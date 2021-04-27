import { Request, Response, NextFunction } from "express";
import JwtHelper from "../utils/helpers/JwtHelper";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";
import socket from 'socket.io';

export function socketMiddleware(socket: socket.Socket, next: (err?: any) => void) {

    const token = socket.handshake.query.token;

    if (!token) {
        return next(new Error("Invalid token"));
    }

    let decoded;

    try {
        decoded = JwtHelper.verify(token);
    } catch (_) {
        return next(new Error("Invalid token"));
    }

    socket.user = decoded;
    return next();
}