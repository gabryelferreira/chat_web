export class RemoveParticipantDTO {
    roomUUID: string;
    participantUUID: string;

    constructor(props: RemoveParticipantDTO) {
        this.roomUUID = props.roomUUID;
        this.participantUUID = props.participantUUID;
    }
}