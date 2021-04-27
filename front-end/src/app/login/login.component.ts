import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';
import { Subscription } from 'rxjs';
import { CreateAccountDTO } from '@app/shared/models/dto/create-account.dto';
import { Store } from '@ngrx/store';
import { IAppState } from '@app/store/app.state';
import { LoginDTO } from '@app/shared/models/dto/login.dto';
import { AuthUserDTO } from '@app/shared/models/dto/auth-user.dto';
import { HttpResponse } from '@angular/common/http';
import { AuthUtil } from '@app/shared/utils/auth-util';
import { IAuthState } from '@app/store/auth/auth.model';
import { AuthActions } from '@app/store/auth/auth.actions';
import { Router } from '@angular/router';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { ValidationHelper } from '@app/shared/utils/validation-helper';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

	email: string;
	name: string;
	password: string;

	loginOpened: boolean = true;
	criarContaClicked: boolean = false;

	loadingLogin: boolean = false;
	loadingCreateAccount: boolean = false;

	createAccountSubscription: Subscription;
	loginSubscription: Subscription;

	constructor(
		private authService: AuthService,
		private store: Store<IAppState>,
		private authUtil: AuthUtil,
		private router: Router,
		private defaultDialog: DefaultDialog,
		private validation: ValidationHelper,
	) {
		this.createAccountSubscription = this.authService.createAccountData$.subscribe(response => {
			this.loadingCreateAccount = false;
			if (response.status === 200) {
				const body = response.body as AuthUserDTO;
				this.handleAuthUser(body);
			} else if (response.status === 409) {
				this.openDialogEmailAlreadyTaken();
			}
		})
		this.loginSubscription = this.authService.loginData$.subscribe(response => {
			this.loadingLogin = false;
			if (response.status === 200) {
				const body = response.body as AuthUserDTO;
				this.handleAuthUser(body);
			} else if (response.status === 404) {
				this.openDialogLoginNotFound();
			}
		})
	}

	ngOnInit(): void {
	}

	ngOnDestroy(): void {
		if (this.createAccountSubscription)
			this.createAccountSubscription.unsubscribe();

		if (this.loginSubscription)
			this.loginSubscription.unsubscribe();
	}

	handleAuthUser(authUser: AuthUserDTO): void {

		const authData: IAuthState = {
			...authUser,
		}
		
		authData.accessToken.expirationDate = this.authUtil.getExpirationDate(authUser.accessToken.expiresIn);
		authData.refreshToken.expirationDate = this.authUtil.getExpirationDate(authUser.refreshToken.expiresIn);

		this.store.dispatch(AuthActions.setData(authData));

		this.router.navigate(["/"]);

	}

	toggleLoginOpened(): void {
		this.criarContaClicked = true;
		this.loginOpened = !this.loginOpened;
	}

	validateLogin(): boolean {
		if (!this.email || !this.email.trim() || !this.password || !this.password.trim()) {
			const title = "CAMPOS OBRIGATÓRIOS";
			const subtitle = "Todos os campos são obrigatórios. Preencha-os corretamente para fazer login.";
			this.defaultDialog.openDialog(title, subtitle);
			return false;
		}

		if (!this.validation.validateEmail(this.email)) {
			const title = "EMAIL INVÁLIDO";
			const subtitle = "O email digitado é inválido. Digite um email válido para fazer login.";
			this.defaultDialog.openDialog(title, subtitle);
			return false;
		}

		return true;
	}

	login(): void {
		if (!this.validateLogin()) return;

		const user = new LoginDTO({
			email: this.email,
			password: this.password,
		});
		this.loadingLogin = true;
		this.authService.login(user);
	}

	validateCreateAccount(): boolean {
		if (!this.email || !this.email.trim() || !this.name || !this.name.trim() || !this.password || !this.password.trim()) {
			const title = "CAMPOS OBRIGATÓRIOS";
			const subtitle = "Todos os campos são obrigatórios. Preencha-os corretamente para criar sua conta.";
			this.defaultDialog.openDialog(title, subtitle);
			return false;
		}

		if (!this.validation.validateEmail(this.email)) {
			const title = "EMAIL INVÁLIDO";
			const subtitle = "O email digitado é inválido. Digite um email válido para criar sua conta.";
			this.defaultDialog.openDialog(title, subtitle);
			return false;
		}

		return true;
	}

	createAccount(): void {
		if (!this.validateCreateAccount()) return;

		const user = new CreateAccountDTO({
			email: this.email,
			name: this.name,
			password: this.password,
		});
		this.loadingCreateAccount = true;
		this.authService.createAccount(user);
	}

	openDialogLoginNotFound() {
		const title = "EMAIL E/OU SENHA INVÁLIDOS";
		const subtitle = "Verifique se você digitou seu email e senha corretamente e tente novamente.";
		this.defaultDialog.openDialog(title, subtitle);
	}

	openDialogEmailAlreadyTaken() {
		const title = "EMAIL JÁ CADASTRADO";
		const subtitle = "O email informado já foi cadastrado. Faça login ou use outro email para criar sua conta.";
		this.defaultDialog.openDialog(title, subtitle);
	}

}
