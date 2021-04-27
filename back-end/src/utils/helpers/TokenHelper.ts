import { VisibleUser } from "../../models/visibleUser";
import JwtHelper from "./JwtHelper";
import { jwtConfig } from "../../config/jwtConfig";
import { IToken } from "../../models/token";

class TokenHelper {

    getTokens(user: VisibleUser): { accessToken: IToken, refreshToken: IToken } {
        const accessToken = JwtHelper.sign(user);
        const refreshToken = JwtHelper.signRefreshToken(user);
        return {
            accessToken: {
                token: accessToken,
                expiresIn: jwtConfig.expiresIn,
            },
            refreshToken: {
                token: refreshToken,
                expiresIn: jwtConfig.refreshExpiresIn,
            },
        }
    }

}

export default new TokenHelper();