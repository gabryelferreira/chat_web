import { IAuthUser } from "./auth-user";

export interface IUserCreateGroup extends IAuthUser {
    alreadyInGroup?: boolean;
}