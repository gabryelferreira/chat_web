import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRoom } from '@app/shared/models/room';
import { DialogAddParticipantData } from '@app/shared/models/dialog-add-participant-data';
import { IAuthUser } from '@app/shared/models/auth-user';
import { SocketHelper } from '@app/shared/utils/socket-helper';
import { UserService } from '@app/core/services/user.service';
import { Subscription } from 'rxjs';
import { IParticipant } from '@app/shared/models/participant';

interface UserInList extends IAuthUser {
  isParticipant?: boolean;
  isAdding?: boolean;
}

@Component({
  selector: 'app-dialog-add-participant',
  templateUrl: './dialog-add-participant.component.html',
  styleUrls: ['./dialog-add-participant.component.scss']
})
export class DialogAddParticipantComponent implements OnInit, OnDestroy {

  room: IRoom;
  participants: IParticipant[] = [];

  users: UserInList[] = [];
  loading: boolean = true;

  email: string;

  searchDebounceTimeout;

  findUsersByEmailSubscription: Subscription;
  addParticipantResponseSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DialogAddParticipantComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: DialogAddParticipantData,
    private socketHelper: SocketHelper,
    private userService: UserService,
  ) {
    this.room = dialogData.room;
    this.participants = [...this.room.participants];

    this.findUsersByEmailSubscription = this.userService.findUsersByEmailData$.subscribe(response => {
      this.loading = false;
      if (response.status === 200) {
        const users = response.body as IAuthUser[];
        this.formatUsers(users);
      }
    })

    this.addParticipantResponseSubscription = this.socketHelper.addParticipantResponseData$.subscribe(response => {
      if (this.room.uuid !== response.room.uuid) return;
      this.participants.push(response.participant);
      this.users = this.users.map(user => {
        if (user.uuid !== response.participant.user.uuid) return user;
        return {
          ...user,
          isAdding: false,
          isParticipant: true,
        }
      })
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.findUsersByEmailSubscription)
      this.findUsersByEmailSubscription.unsubscribe();

    if (this.addParticipantResponseSubscription)
      this.addParticipantResponseSubscription.unsubscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  search() {
    clearTimeout(this.searchDebounceTimeout);

    this.loading = true;
    this.users = [];

    this.searchDebounceTimeout = setTimeout(() => {

      if (!this.email || !this.email.trim() || this.email.trim().length < 3) return;

      this.users = [];

      this.userService.findUsersByEmail(this.email);

    }, 1200);
  }

  addParticipant(user: UserInList) {
    user.isAdding = true;
    this.socketHelper.addParticipant(this.room.uuid, user.uuid);
  }

  formatUsers(users: IAuthUser[]) {
    const formattedUsers: UserInList[] = users.map(user => {
      const isParticipant = this.room.participants.findIndex(p => p.user.uuid === user.uuid) > -1;
      return {
        ...user,
        isAdding: false,
        isParticipant,
      }
    })
    this.users = formattedUsers;
  }

}
