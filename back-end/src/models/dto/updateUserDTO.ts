import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserDTO {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    name: string;

    constructor(props: UpdateUserDTO) {
        this.email = props.email;
        this.name = props.name;
    }
}