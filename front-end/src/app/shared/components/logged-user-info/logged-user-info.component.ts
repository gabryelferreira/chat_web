import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IAuthUser } from '@app/shared/models/auth-user';
import { State, Store } from '@ngrx/store';
import { IAppState } from '@app/store/app.state';
import { Router } from '@angular/router';
import { RoomActions } from '@app/store/room/room.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'logged-user-info',
  templateUrl: './logged-user-info.component.html',
  styleUrls: ['./logged-user-info.component.scss']
})
export class LoggedUserInfoComponent implements OnInit, OnDestroy {

  user: IAuthUser;

  @Output('onCloseMenu') onCloseMenu = new EventEmitter();

  listenToUserSubscription: Subscription;

  constructor(
    private state: State<IAppState>,
    private store: Store<IAppState>,
    private router: Router,
  ) {
    this.listenToUserSubscription = this.store.select((state: IAppState) => state.auth)
      .subscribe(auth => {
        this.user = auth?.user;
      });
  }

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    if (this.listenToUserSubscription)
      this.listenToUserSubscription.unsubscribe();
  }

  openProfile() {
    this.router.navigate(["perfil"]);
    this.onCloseMenu.emit();
  }

}
