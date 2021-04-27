import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDTO {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    password: string;

    constructor(createUserDTO: CreateUserDTO) {
        this.email = createUserDTO.email;
        this.name = createUserDTO.name;
        this.password = createUserDTO.password;
    }
}