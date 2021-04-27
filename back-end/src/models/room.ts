import { IParticipant } from "./participant";

export class IRoom {
    uuid: string;
    name: string;
    idRoomType: number;
    participants: IParticipant[];
    updatedAt: Date;
    createdAt: Date;
    unreadMessages: number;
    imgUrl: string;
}

export interface OverrideRoom {
    uuid?: string;
    name?: string;
    idRoomType?: number;
    participants?: IParticipant[];
    updatedAt?: Date;
    createdAt?: Date;
    unreadMessages?: number;
    imgUrl?: string;
}