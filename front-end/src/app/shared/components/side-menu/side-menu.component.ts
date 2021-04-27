import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Store, State } from '@ngrx/store';
import { IAppState } from '@app/store/app.state';
import { Subscription } from 'rxjs';
import { IRoom } from '@app/shared/models/room';
import { RoomActions } from '@app/store/room/room.actions';
import { RoomService } from '@app/core/services/room.service';
import { Router, NavigationEnd, Event } from '@angular/router';
import { DefaultDialog } from '@app/shared/utils/default-dialog';
import { IDefaultDialogButton } from '@app/shared/models/default-dialog-button';
import { AuthActions } from '@app/store/auth/auth.actions';
import { RoomType } from '@app/shared/utils/constants/roomType';
import { IAuthUser } from '@app/shared/models/auth-user';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogManageGroupComponent } from '../dialogs/dialog-manage-group/dialog-manage-group.component';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  @Output('onCloseMenu') onCloseMenu = new EventEmitter();

  rooms: IRoom[];
  selectedRoom: string;

  groups: IRoom[];
  privates: IRoom[];

  allChatsSubscription: Subscription;
  selectedRoomSubscription: Subscription;
  roomsSubscription: Subscription;
  routeChangeSubscription: Subscription;

  currentUrl: string;

  constructor(
    private store: Store<IAppState>,
    private service: RoomService,
    private state: State<IAppState>,
    private router: Router,
    private defaultDialog: DefaultDialog,
    private dialog: MatDialog,
  ) {
    this.allChatsSubscription = this.service.allRoomsData$.subscribe(response => {
      if (response.status === 200) {
        const rooms = response.body as IRoom[];
        this.handleGetRooms(rooms);
      }
    })

    this.service.getAllRooms();

    this.roomsSubscription = store.select((state: IAppState) => state.room.rooms)
      .subscribe(rooms => {
        this.rooms = rooms;
        this.privates = this.rooms.filter(room => room.idRoomType === RoomType.PRIVATE && !room.deleted);
        this.groups = this.rooms.filter(room => room.idRoomType === RoomType.GROUP);
      });
    this.selectedRoomSubscription = store.select((state: IAppState) => state.room.selectedRoom)
      .subscribe(uuid => {
        this.selectedRoom = uuid;
      });

    this.listenToRouteChange();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.roomsSubscription)
      this.roomsSubscription.unsubscribe();

    if (this.selectedRoomSubscription)
      this.selectedRoomSubscription.unsubscribe();

    if (this.routeChangeSubscription)
      this.routeChangeSubscription.unsubscribe();
  }

  listenToRouteChange() {
    this.routeChangeSubscription = this.router.events.subscribe((route: Event) => {
      if (route instanceof NavigationEnd) {
        this.currentUrl = route.url;
        const splitRoute = route.url.split("/");
        splitRoute.splice(0, 1);
        if (splitRoute.length === 2 && splitRoute[0] === "chat") {
          this.store.dispatch(RoomActions.setSelectedRoom(splitRoute[1]));
        } else {
          this.store.dispatch(RoomActions.setSelectedRoom(null));
        }
      }
    });
  }

  handleGetRooms(rooms: IRoom[]) {
    const state: IAppState = this.state.getValue();
    const currentRooms = state.room.rooms;
    rooms.forEach(room => {
      const find = currentRooms.find(x => x.uuid === room.uuid);
      if (!find) {
        this.store.dispatch(RoomActions.addRoom(room));
      } else {
        this.store.dispatch(RoomActions.setRoom(room));
      }
    })
    currentRooms.forEach(room => {
      const find = rooms.find(x => x.uuid === room.uuid);
      if (!find) {
        this.store.dispatch(RoomActions.removeRoom(room.uuid));
      }
    })
  }

  selectRoom(room: IRoom) {
    this.router.navigate([`/chat/${room.uuid}`]);
    this.onCloseMenu.emit();
  }

  openSearchUsers() {
    this.router.navigate(["/buscar"]);
    this.onCloseMenu.emit();
  }

  openCreateGroup() {
    const config = this.configureCreateGroupDialog();
    this.dialog.open(DialogManageGroupComponent, config);
    
  }

  private configureCreateGroupDialog(): MatDialogConfig<DialogManageGroupComponent> {
    const dialogConfig = new MatDialogConfig();
      dialogConfig.width = "450px";
      return dialogConfig;
  }

  setRoomDeleted(room: IRoom) {
    this.store.dispatch(RoomActions.setRoomDeleted(room));
  }

}
