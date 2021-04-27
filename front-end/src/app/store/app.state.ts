import { IAuthState } from "./auth/auth.model";
import { IRoomState } from "./room/room.model";

export interface IAppState {
    auth: IAuthState;
    room: IRoomState;
}