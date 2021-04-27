import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDTO {

    @IsNotEmpty()
    @IsString()
    roomUUID: string;

    @IsNotEmpty()
    @IsString()
    fakeMessageUUID: string;
    
    message: string;
    
    attachmentSignedUrlUUID?: string;

    constructor(props: CreateMessageDTO) {
        this.roomUUID = props.roomUUID;
        this.message = props.message;
        this.fakeMessageUUID = props.fakeMessageUUID;
        this.attachmentSignedUrlUUID = props.attachmentSignedUrlUUID;
    }
}