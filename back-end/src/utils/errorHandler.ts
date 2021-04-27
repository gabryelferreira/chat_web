import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "./constants/httpStatus";
import { HttpException } from "../models/httpException";

export async function errorHandler(err: HttpException | any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpException) {
        res.status(err.status ?? HttpStatus.INTERNAL_SERVER_ERROR);
        res.json(err);
    }
    next(err);
}