import { validate } from "class-validator";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "./constants/httpStatus";

export default async function validateModel(model: Object) {
    const errors = await validate(model);
    const errorsMessages: string[] = [];

    errors.forEach((error) => {
        const contraints = Object.values(error.constraints ?? []);
        contraints.forEach((errorMessage => {
            errorsMessages.push(errorMessage);
        }));
    });

    if (errors.length > 0) {
        throw new HttpException(errorsMessages, HttpStatus.BAD_REQUEST);
    }
}