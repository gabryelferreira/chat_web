import { IAuthUser } from "./auth-user";

export interface IParticipant {
    uuid: string;
    createdAt: Date;
    user: IAuthUser;
    isAdmin: boolean;
    isTyping?: boolean;
}