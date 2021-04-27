export class AddParticipantDTO {
    roomUUID: string;
    userUUID: string;

    constructor(props: AddParticipantDTO) {
        this.roomUUID = props.roomUUID;
        this.userUUID = props.userUUID;
    }
}