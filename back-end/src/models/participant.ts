import { VisibleUser, OverrideVisibleUser } from "./visibleUser";

export interface IParticipant {
    uuid: string;
    createdAt: Date;
    user: VisibleUser;
    isAdmin: boolean;
}

export interface OverrideParticipant {
    uuid?: string;
    createdAt?: Date;
    user?: OverrideVisibleUser;
    isAdmin?: boolean;
}