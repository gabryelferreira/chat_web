import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { IDefaultDialogButton } from '@app/shared/models/default-dialog-button';
import { IRoom } from '@app/shared/models/room';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { DialogHelper } from '@app/shared/utils/dialog-helper';
import { SocketHelper } from '@app/shared/utils/socket-helper';
import { DialogManageGroupComponent } from '../dialogs/dialog-manage-group/dialog-manage-group.component';

@Component({
  selector: 'chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss']
})
export class ChatHeaderComponent implements OnInit {

  @Input("room") room: IRoom;
  @Input("isUserGroupAdmin") isUserGroupAdmin: boolean;
  @Input("chatParticipantsListOpened") chatParticipantsListOpened: boolean;

  @Output("onToggleChatParticipantsList") onToggleChatParticipantsList = new EventEmitter();
  @Output("onLeaveRoom") onLeaveRoom = new EventEmitter();

  constructor(
    private defaultDialog: DefaultDialog,
    private socketHelper: SocketHelper,
    private dialogHelper: DialogHelper,
  ) { }

  ngOnInit(): void {
  }

  leaveRoom() {
    const title = "SAIR DO GRUPO";
    const subtitle = "Tem certeza que deseja sair do grupo? Você não terá mais acesso as mensagens dele.";
    const buttons: IDefaultDialogButton[] = [
      { text: "Cancelar", value: false, class: 'transparent smaller' },
      { text: "Sair", value: true, class: 'red smaller' }
    ]
    this.defaultDialog.openDialog(title, subtitle, {
      buttons,
      afterClosed: (value: boolean) => {
        if (value) {
          this.confirmLeaveRoom();
        }
      }
    })
  }

  openManageGroup() {
    this.dialogHelper.openManageGroupDialog(this.room);
  }

  confirmLeaveRoom() {
    this.onLeaveRoom.emit();
    this.socketHelper.leaveRoom(this.room.uuid);
  }

  toggleChatParticipantsListOpened() {
    this.onToggleChatParticipantsList.emit();
  }

}
