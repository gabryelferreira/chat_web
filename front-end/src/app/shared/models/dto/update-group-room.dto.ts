export class UpdateGroupRoomDTO {
    roomUUID: string;
    name: string;
    signedUrlUUID?: string;
    removeImage?: boolean;

    constructor(props: UpdateGroupRoomDTO) {
        this.roomUUID = props.roomUUID;
        this.name = props.name;
        this.signedUrlUUID = props.signedUrlUUID;
        this.removeImage = props.removeImage;
    }
}