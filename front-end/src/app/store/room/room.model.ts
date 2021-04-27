import { IAuthUser } from "@app/shared/models/auth-user";
import { IToken } from "@app/shared/models/token";
import { IParticipant } from "@app/shared/models/participant";
import { IRoom } from "@app/shared/models/room";
import { IMessage } from "@app/shared/models/message";

export interface IRoomState {
    selectedRoom: string;
    rooms: IRoom[];
}

export const ROOM_INITIAL_STATE: IRoomState = {
    selectedRoom: null,
    rooms: [],
};