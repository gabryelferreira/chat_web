import { Request, Response, NextFunction } from "express";
import JwtHelper from "../utils/helpers/JwtHelper";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";

export function userMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new HttpException("No token provided", HttpStatus.UNAUTHORIZED);
    }

    const arrayAuth = authHeader.split(' ');
    if (arrayAuth.length != 2 || arrayAuth[0] != 'Bearer') {
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    const token = arrayAuth[1];

    let decoded;

    try {
        decoded = JwtHelper.verify(token);
    } catch (_) {
        throw new HttpException("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    req.user = decoded;
    return next();
}