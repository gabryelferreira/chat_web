import { IsNotEmpty, IsString } from 'class-validator';
import { IParticipant } from '../participant';
import { IRoom } from '../room';

export class AddParticipantResponseDTO {
    room: IRoom;
    participant: IParticipant;

    constructor(props: AddParticipantResponseDTO) {
        this.room = props.room;
        this.participant = props.participant;
    }
}