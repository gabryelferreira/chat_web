import { createAction } from '@ngrx/store';
import { IAction } from '../action';
import { Injectable } from '@angular/core';
import { IRoom } from '@app/shared/models/room';
import { IMessage } from '@app/shared/models/message';
import { IParticipant } from '@app/shared/models/participant';
import { IAuthUser } from '@app/shared/models/auth-user';

@Injectable()
export class RoomActions {
    static readonly SET_INITIAL_STATE = "RoomActions_SET_INITIAL_STATE";
    static readonly SET_SELECTED_ROOM = "RoomActions_SET_SELECTED_ROOM";
    static readonly ADD_MESSAGE = "RoomActions_ADD_MESSAGE";
    static readonly ADD_ROOM = "RoomActions_ADD_ROOM";
    static readonly SET_ROOM_DELETED = "RoomActions_SET_ROOM_DELETED";
    static readonly SET_ROOM = "RoomActions_SET_ROOM";
    static readonly REMOVE_PARTICIPANT = "RoomActions_REMOVE_PARTICIPANT";
    static readonly ADD_PARTICIPANT = "RoomActions_ADD_PARTICIPANT";
    static readonly REMOVE_ROOM = "RoomActions_REMOVE_ROOM";
    static readonly SET_ROOM_MAIN_INFO = "RoomActions_SET_ROOM_MAIN_INFO";
    static readonly SET_USER_TYPING = "RoomActions_SET_USER_TYPING";

    static setInitialState = (): IAction => ({
        type: RoomActions.SET_INITIAL_STATE,
    })

    static addRoom = (room: IRoom): IAction => ({
        type: RoomActions.ADD_ROOM,
        payload: room,
    })

    static setRoomDeleted = (room: IRoom, deleted: boolean = true): IAction => ({
        type: RoomActions.SET_ROOM_DELETED,
        payload: {
            room,
            deleted,
        },
    })

    static setRoom = (room: IRoom): IAction => ({
        type: RoomActions.SET_ROOM,
        payload: room,
    })

    static setSelectedRoom = (uuid: string): IAction => ({
        type: RoomActions.SET_SELECTED_ROOM,
        payload: uuid,
    });

    static addMessage = (roomUUID: string, message: IMessage): IAction => ({
        type: RoomActions.ADD_MESSAGE,
        payload: {
            roomUUID,
            message,
        },
    })

    static removeParticipant = (roomUUID: string, participant: IParticipant, isLoggedUser: boolean): IAction => ({
        type: RoomActions.REMOVE_PARTICIPANT,
        payload: {
            roomUUID,
            participant,
            isLoggedUser,
        },
    })

    static addParticipant = (room: IRoom, participant: IParticipant, isLoggedUser: boolean): IAction => ({
        type: RoomActions.ADD_PARTICIPANT,
        payload: {
            room,
            participant,
            isLoggedUser,
        },
    })

    static removeRoom = (roomUUID: string): IAction => ({
        type: RoomActions.REMOVE_ROOM,
        payload: roomUUID,
    })

    static setRoomMainInfo = (room: IRoom): IAction => ({
        type: RoomActions.SET_ROOM_MAIN_INFO,
        payload: room,
    })

    static setUserTyping = (roomUUID: string, user: IAuthUser, isTyping: boolean): IAction => ({
        type: RoomActions.SET_USER_TYPING,
        payload: {
            roomUUID,
            user,
            isTyping,
        }
    })


}