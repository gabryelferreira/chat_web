import { VisibleUser } from "./visibleUser";
import * as socket from "socket.io";

export interface SocketUser {
    user: VisibleUser;
    socket: socket.Socket;
}