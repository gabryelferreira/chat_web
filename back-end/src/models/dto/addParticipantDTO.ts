import { IsNotEmpty, IsString } from 'class-validator';

export class AddParticipantDTO {

    @IsNotEmpty()
    @IsString()
    roomUUID: string;

    @IsNotEmpty()
    @IsString()
    userUUID: string;

    constructor(props: AddParticipantDTO) {
        this.roomUUID = props.roomUUID;
        this.userUUID = props.userUUID;
    }
}