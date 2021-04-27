import { VisibleUser, OverrideVisibleUser } from "./visibleUser";
import { IAttachment, OverrideAttachment } from "./attachment";

export interface IMessage {
    uuid: string;
    message: string;
    user: VisibleUser;
    createdAt: Date;
    updatedAt: Date;
    attachment: IAttachment;
}

export interface OverrideMessage {
    uuid?: string;
    message?: string;
    user?: OverrideVisibleUser;
    createdAt?: Date;
    updatedAt?: Date;
    type?: number;
    attachment?: IAttachment;
}