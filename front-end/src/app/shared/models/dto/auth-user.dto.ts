import { IAuthUser } from "../auth-user";
import { IToken } from "../token";

export class AuthUserDTO {
    user: IAuthUser;
    accessToken: IToken;
    refreshToken: IToken;
}