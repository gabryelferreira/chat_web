import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdateGroupRoomDTO {

    @IsNotEmpty()
    @IsString()
    roomUUID: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    signedUrlUUID?: string;

    @IsBoolean()
    removeImage: string;

    constructor(props: UpdateGroupRoomDTO) {
        this.roomUUID = props.roomUUID;
        this.name = props.name;
        this.signedUrlUUID = props.signedUrlUUID;
        this.removeImage = props.removeImage;
    }
}