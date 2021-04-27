import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveParticipantDTO {

    @IsNotEmpty()
    @IsString()
    roomUUID: string;

    @IsNotEmpty()
    @IsString()
    participantUUID: string;

    constructor(props: RemoveParticipantDTO) {
        this.roomUUID = props.roomUUID;
        this.participantUUID = props.participantUUID;
    }
}