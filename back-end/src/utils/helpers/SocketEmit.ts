import Socket from "./Socket";
import { SocketAction } from "../constants/socketAction";
import { IRoom } from "../../models/room";

class SocketEmit {

    createRoom(userUUID: string, room: IRoom) {
        Socket.io.to(userUUID).emit(SocketAction.NEW_ROOM, room);
    }

}

export default new SocketEmit();