import { IAuthUser } from "@app/shared/models/auth-user";
import { IToken } from "@app/shared/models/token";

export interface IAuthState {
    user: IAuthUser;
    accessToken: IToken;
    refreshToken: IToken;
}

export const AUTH_INITIAL_STATE: IAuthState = null;