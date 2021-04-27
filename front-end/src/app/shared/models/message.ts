import { IAuthUser } from "./auth-user";
import { IAttachment } from "./attachment";

export interface IMessage {
    uuid: string;
    message: string;
    user: IAuthUser;
    createdAt: Date;
    updatedAt: Date;
    fakeUUID?: string;
    attachment?: IAttachment;
}