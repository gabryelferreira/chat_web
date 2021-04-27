import { createAction } from '@ngrx/store';
import { IAction } from '../action';
import { Injectable } from '@angular/core';
import { IAuthState } from './auth.model';
import { IAuthUser } from '@app/shared/models/auth-user';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable()
export class AuthActions {
    static readonly SET_DATA = "AuthActions_SET_DATA";
    static readonly UPDATE_USER = "AuthActions_UPDATE_USER";

    static setData = (auth: IAuthState): IAction => ({
        type: AuthActions.SET_DATA,
        payload: auth,
    });

    static updateUser = (user: IAuthUser): IAction => ({
        type: AuthActions.UPDATE_USER,
        payload: user,
    })


}