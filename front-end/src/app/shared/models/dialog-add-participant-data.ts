import { IRoom } from "./room";

export class DialogAddParticipantData {
    room: IRoom;

    constructor(props: DialogAddParticipantData) {
        this.room = props.room;
    }
}