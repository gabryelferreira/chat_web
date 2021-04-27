import { IParticipant } from "../participant";

export class RemoveParticipantResponseDTO {
    roomUUID: string;
    participant: IParticipant;

    constructor(props: RemoveParticipantResponseDTO) {
        this.roomUUID = props.roomUUID;
        this.participant = props.participant;
    }
}