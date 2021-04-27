import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDTO {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    constructor(props: LoginDTO) {
        this.email = props.email;
        this.password = props.password;
    }
}