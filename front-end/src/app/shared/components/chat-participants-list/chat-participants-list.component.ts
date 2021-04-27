import { Component, Input, OnInit } from '@angular/core';
import { IAuthUser } from '@app/shared/models/auth-user';
import { IDefaultDialogButton } from '@app/shared/models/default-dialog-button';
import { IParticipant } from '@app/shared/models/participant';
import { IRoom } from '@app/shared/models/room';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { DialogHelper } from '@app/shared/utils/dialog-helper';
import { SocketHelper } from '@app/shared/utils/socket-helper';
import { IAppState } from '@app/store/app.state';
import { State } from '@ngrx/store';

@Component({
  selector: 'chat-participants-list',
  templateUrl: './chat-participants-list.component.html',
  styleUrls: ['./chat-participants-list.component.scss']
})
export class ChatParticipantsListComponent implements OnInit {

  @Input("isOpened") isOpened: boolean;
  @Input("room") room: IRoom;
  @Input("isUserGroupAdmin") isUserGroupAdmin: boolean;

  loggedUser: IAuthUser;

  constructor(
    private defaultDialog: DefaultDialog,
    private socketHelper: SocketHelper,
    private dialogHelper: DialogHelper,
    private state: State<IAppState>,
  ) {
    this.initLoggedUser();
  }

  ngOnInit(): void {
  }

  initLoggedUser(): void {
    const state: IAppState = this.state.getValue();
    this.loggedUser = state.auth.user;
  }

  confirmDeleteParticipant(participant: IParticipant) {
    const title = "REMOVER USUÁRIO";
    const subtitle = `Deseja remover o usuário ${participant.user.name} do grupo ${this.room.name}?`;
    const buttons: IDefaultDialogButton[] = [
      { text: "Cancelar", value: false, class: "transparent smaller" },
      { text: "Remover usuário", value: true, class: "red smaller" },
    ]
    this.defaultDialog.openDialog(title, subtitle, {
      buttons,
      afterClosed: (value: boolean) => {
        if (value) {
          this.socketHelper.removeParticipant(this.room.uuid, participant.uuid);
        }
      }
    })
  }

  addParticipant() {
    this.dialogHelper.openAddParticipantDialog(this.room);
  }

}
