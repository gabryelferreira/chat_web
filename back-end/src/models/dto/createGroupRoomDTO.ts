import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupRoomDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    signedUrlUUID?: string;

    constructor(props: CreateGroupRoomDTO) {
        this.name = props.name;
        this.signedUrlUUID = props.signedUrlUUID;
    }
}