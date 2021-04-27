import { IParticipant } from "./participant";

export interface IRoom {
    uuid: string;
    name: string;
    idRoomType: number;
    participants: IParticipant[];
    updatedAt: Date;
    createdAt: Date;
    unreadMessages: number;
    deleted?: boolean;
    imgUrl?: string;
}