export class CreateGroupRoomDTO {
    name: string;
    signedUrlUUID?: string;

    constructor(props: CreateGroupRoomDTO) {
        this.name = props.name;
        this.signedUrlUUID = props.signedUrlUUID;
    }
}