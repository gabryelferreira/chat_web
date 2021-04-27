import { HttpStatus } from "../utils/constants/httpStatus";

export class HttpException {

    message?: any;
    status?: HttpStatus;

    constructor(message?: any, status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
        this.message = message;
        this.status = status;
    }
    
}