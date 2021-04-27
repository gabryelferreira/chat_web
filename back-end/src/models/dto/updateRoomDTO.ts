import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoomDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    signedUrlUUID?: string;

    constructor(props: UpdateRoomDTO) {
        this.name = props.name;
        this.signedUrlUUID = props.signedUrlUUID;
    }
}