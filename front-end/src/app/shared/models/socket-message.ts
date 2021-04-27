import { IMessage } from "./message";

export interface ISocketMessage {
    roomUUID: string;
    message: IMessage;
}