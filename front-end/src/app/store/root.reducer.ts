import { ActionReducerMap } from "@ngrx/store";
import { IAppState } from "./app.state";
import { authReducer } from "./auth/auth.reducer";
import { roomReducer } from "./room/room.reducer";

export const rootReducer: ActionReducerMap<IAppState> = {
    auth: authReducer,
    room: roomReducer,
}