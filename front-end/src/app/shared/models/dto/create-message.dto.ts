
export class CreateMessageDTO {
    roomUUID: string;
    message: string;
    fakeMessageUUID: string;
    attachmentSignedUrlUUID?: string;

    constructor(props: CreateMessageDTO) {
        this.roomUUID = props.roomUUID;
        this.message = props.message;
        this.fakeMessageUUID = props.fakeMessageUUID;
        this.attachmentSignedUrlUUID = props.attachmentSignedUrlUUID;
    }
}