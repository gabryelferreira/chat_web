import { Request, Response, NextFunction } from "express";
import JwtHelper from "../utils/helpers/JwtHelper";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";

export function refreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new HttpException("No refresh token provided", HttpStatus.UNAUTHORIZED);
    }

    let decoded;

    try {
        decoded = JwtHelper.verifyRefreshToken(refreshToken);
    } catch (_) {
        throw new HttpException("Invalid refresh token", HttpStatus.UNAUTHORIZED);
    }

    req.user = decoded;
    return next();
}