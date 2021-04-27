import * as jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwtConfig';
import { VisibleUser } from '../../models/visibleUser';

class JwtHelper {

    sign(user: VisibleUser): string {
        return jwt.sign({ ...user }, jwtConfig.key, {
            expiresIn: jwtConfig.expiresIn,
        });
    }

    verify(token: string): VisibleUser | undefined {
        return jwt.verify(token, jwtConfig.key) as VisibleUser | undefined;
    }

    signRefreshToken(user: VisibleUser): string {
        return jwt.sign({ ...user }, jwtConfig.refreshKey, {
            expiresIn: jwtConfig.refreshExpiresIn,
        });
    }

    verifyRefreshToken(token: string): VisibleUser | undefined {
        return jwt.verify(token, jwtConfig.refreshKey) as VisibleUser | undefined;
    }

}

export default new JwtHelper();