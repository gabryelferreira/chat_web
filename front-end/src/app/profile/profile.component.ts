import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAppState } from '@app/store/app.state';
import { State, Store } from '@ngrx/store';
import { IAuthUser } from '@app/shared/models/auth-user';
import { IDefaultDialogButton } from '@app/shared/models/default-dialog-button';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { AuthActions } from '@app/store/auth/auth.actions';
import { RoomActions } from '@app/store/room/room.actions';
import { Router } from '@angular/router';
import { FileHelper } from '@app/shared/utils/file-helper';
import { CommonFile } from '@app/shared/models/common-file';
import { UserService } from '@app/core/services/user.service';
import { Subscription } from 'rxjs';
import { ISignedUrl } from '@app/shared/models/signed-url';
import { ValidationHelper } from '@app/shared/utils/validation-helper';
import { HttpError } from '@app/shared/models/http-error';
import { UploadHelper } from '@app/shared/utils/upload-helper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: IAuthUser;

  name: string;
  email: string;
  imgUrl: string;

  selectedFile: CommonFile;

  loading: boolean = false;
  saving: boolean = false;

  getMyUserSubscription: Subscription;
  updateAvatarSubscription: Subscription;
  updateUserSubscription: Subscription;
  removeAvatarSubscription: Subscription;


  constructor(
    private state: State<IAppState>,
    private defaultDialog: DefaultDialog,
    private store: Store<IAppState>,
    private router: Router,
    private fileHelper: FileHelper,
    private userService: UserService,
    private validation: ValidationHelper,
    private uploadHelper: UploadHelper,
  ) {
    this.getUserData();

    this.getMyUserSubscription = this.userService.getMyUserData$.subscribe(response => {
      this.loading = false;
      if (response.status === 200) {
        const user = response.body as IAuthUser;
        this.user = user;
        this.name = this.user.name;
        this.email = this.user.email;
        this.imgUrl = this.user.imgUrl;
        this.store.dispatch(AuthActions.updateUser(user));
      } else {
        this.initUserFromStore();
        this.defaultDialog.openDialog("UM ERRO ACONTECEU", "Ocorreu um erro quando temos buscar seus dados, mas você pode tentar atualizá-los.");
      }
    })

    this.updateAvatarSubscription = this.userService.updateAvatarData$.subscribe(response => {
      if (response.status === 200) {
        const avatarUrl = response.body as string;
        this.userService.updateUser(this.name, this.email);
      } else {
        this.openDialogError((response.body as HttpError).message);
        this.saving = false;
      }
    })

    this.removeAvatarSubscription = this.userService.removeAvatarData$.subscribe(response => {
      if (response.status === 200) {
        this.userService.updateUser(this.name, this.email);
      } else {
        this.openDialogError();
        this.saving = false;
      }
    })

    this.updateUserSubscription = this.userService.updateUserData$.subscribe(response => {
      this.saving = false;
      if (response.status === 200) {
        const user = response.body as IAuthUser;
        this.store.dispatch(AuthActions.updateUser(user));
        this.defaultDialog.openDialog("DADOS ATUALIZADOS", "Seus dados foram atualizados com sucesso!");
      } else {
        this.openDialogError((response.body as HttpError).message);
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.updateAvatarSubscription)
      this.updateAvatarSubscription.unsubscribe();

    if (this.updateUserSubscription)
      this.updateUserSubscription.unsubscribe();

    if (this.removeAvatarSubscription)
      this.removeAvatarSubscription.unsubscribe();
  }

  getUserData() {
    this.loading = true;
    this.userService.getMyUser();
  }

  initUserFromStore() {
    const state: IAppState = this.state.getValue();
    this.user = state.auth.user;
    this.name = this.user.name;
    this.email = this.user.email;
    this.imgUrl = this.user.email;
  }

  exit() {
    const title = "CONFIRME SUA SAÍDA";
    const subtitle = "Tem certeza que deseja sair? Não se preocupe, suas conversas estarão salvas.";
    const buttons: IDefaultDialogButton[] = [
      { text: "Cancelar", value: false, class: 'transparent smaller' },
      { text: "Sair", value: true, class: 'red smaller' }
    ]
    this.defaultDialog.openDialog(title, subtitle, {
      buttons,
      afterClosed: (value: boolean) => {
        if (value) {
          this.confirmLogout();
        }
      }
    })
  }

  confirmLogout() {
    this.store.dispatch(AuthActions.setData(null));
    this.router.navigate(['/login']);
    this.store.dispatch(RoomActions.setInitialState());
  }

  validate(): boolean {
		if (!this.email || !this.email.trim() || !this.name || !this.name.trim()) {
			const title = "CAMPOS OBRIGATÓRIOS";
			const subtitle = "O nome e e-mail são obrigatórios. Preencha-os corretamente para atualizar sua conta.";
			this.defaultDialog.openDialog(title, subtitle);
			return false;
		}

		if (!this.validation.validateEmail(this.email)) {
			const title = "EMAIL INVÁLIDO";
			const subtitle = "O email digitado é inválido. Digite um email válido para atualizar sua conta.";
			this.defaultDialog.openDialog(title, subtitle);
			return false;
		}

		return true;
	}

  async save() {
    this.saving = true;

    if (!this.validate()) return;

    if (this.selectedFile) {
      this.uploadAvatar();
    } else if (this.imgUrl === null && this.user.imgUrl) {
      this.userService.removeAvatar();
    } else {
      this.userService.updateUser(this.name, this.email);
    }
  }

  async uploadAvatar() {
    let signedUrl: ISignedUrl;
      try {
        signedUrl = await this.uploadHelper.upload(this.selectedFile);
      } catch (_) {
        this.defaultDialog.openDialog("UM ERRO ACONTECEU", "Ocorreu um erro ao tentar fazer upload da imagem.");
        return;
      }
      this.userService.updateAvatar(signedUrl.uuid);
  }

  openDialogError(subtitle?: string): void {
    const title = "UM ERRO ACONTECEU";
    this.defaultDialog.openDialog(title, subtitle ?? "Aconteceu um erro inesperado. Recarregue a página e tente novamente.");
  }

}
