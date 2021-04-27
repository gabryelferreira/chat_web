import { IMessage } from "../message";

export class CreateMessageResponseDTO {
    roomUUID: string;
    message: IMessage;
    fakeMessageUUID: string;

    constructor(props: CreateMessageResponseDTO) {
        this.roomUUID = props.roomUUID;
        this.message = props.message;
        this.fakeMessageUUID = props.fakeMessageUUID;
    }
}