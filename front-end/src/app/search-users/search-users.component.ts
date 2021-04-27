import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import { IAuthUser } from '@app/shared/models/auth-user';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { Subscription } from 'rxjs';
import { RoomService } from '@app/core/services/room.service';
import { Store, State } from '@ngrx/store';
import { IAppState } from '@app/store/app.state';
import { RoomActions } from '@app/store/room/room.actions';
import { IRoom } from '@app/shared/models/room';
import { Router } from '@angular/router';
import { IUserCreateGroup } from '@app/shared/models/user-create-group';
import { SocketHelper } from '@app/shared/utils/socket-helper';

@Component({
  selector: 'search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss']
})
export class SearchUsersComponent implements OnInit, OnDestroy {

  email: string;
  searched: boolean = false;

  users: IAuthUser[] = [];

  loading: boolean = false;
  initializingMessage: boolean = false;

  findUsersByEmailSubscription: Subscription;
  getPrivateRoomAndCreateSubscription: Subscription;

  constructor(
    private service: UserService,
    private roomService: RoomService,
    private defaultDialog: DefaultDialog,
    private store: Store<IAppState>,
    private router: Router,
    private state: State<IAppState>,
    private socketHelper: SocketHelper,
  ) {

    this.initializeUsersFromChats();

    this.findUsersByEmailSubscription = this.service.findUsersByEmailData$.subscribe(response => {
      this.loading = false;
      if (response.status === 200) {
        this.users = response.body as IAuthUser[];
        if (this.users.length === 0) {
          this.openDialogUsersNotFound();
        }
      } else {
        this.openDialogError();
      }
    })

    this.getPrivateRoomAndCreateSubscription = this.roomService.getPrivateRoomAndCreateData$.subscribe(response => {
      this.initializingMessage = false;
      if (response.status === 200) {
        const room = response.body as IRoom;
        const state: IAppState = this.state.getValue();
        const rooms = state.room.rooms;

        if (!rooms.find(x => x.uuid === room.uuid)) {
          this.store.dispatch(RoomActions.addRoom(room));
        } else {
          this.store.dispatch(RoomActions.setRoomDeleted(room, false));
        }

        this.router.navigate([`/chat/${room.uuid}`]);
        this.socketHelper.socket.emit("join", room.uuid);


      } else {
        this.openDialogChatError();
      }
    })

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.findUsersByEmailSubscription?.unsubscribe();
    this.getPrivateRoomAndCreateSubscription?.unsubscribe();
  }

  initializeUsersFromChats() {
    const state: IAppState = this.state.getValue();
    const loggedUser = state.auth.user;
    const rooms = state.room.rooms;
    const users: IUserCreateGroup[] = [];

    rooms.forEach(room => {
      room.participants.forEach(participant => {
        const user = participant.user;
        if (!users.find(x => x.uuid === user.uuid) && user.uuid !== loggedUser.uuid) {
          users.push({
            ...user,
            alreadyInGroup: false
          });
        }
      })
    })
    this.users = users;
  }

  searchUsers(): void {
    if (!this.email || !this.email.trim() || this.email.trim().length < 3 || this.loading) return;

    this.loading = true;

    this.users = [];

    this.service.findUsersByEmail(this.email);

  }

  openDialogUsersNotFound() {
    const title = "NENHUM USUÁRIO ENCONTRADO";
    const description = "Hum, não funcionou. Tentamos buscar usuários com o email informado mas nenhum foi encontrado.";
    this.defaultDialog.openDialog(title, description);
  }

  openDialogError() {
    const title = "UM ERRO ACONTECEU";
    const description = "Ocorreu um erro quando tentamos realizar sua busca. Verifique sua internet e tente novamente.";
    this.defaultDialog.openDialog(title, description);
  }

  openDialogChatError() {
    const title = "UM ERRO ACONTECEU";
    const description = "Ocorreu um erro quando tentamos iniciar sua conversa. Verifique sua internet e tente novamente.";
    this.defaultDialog.openDialog(title, description);
  }

  openChatWithUser(user: IAuthUser) {
    this.initializingMessage = true;
    this.roomService.getPrivateChatAndCreateIfNotExists(user.uuid);
  }

}
