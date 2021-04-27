export class CreateAccountDTO {
    email: string;
    name: string;
    password: string;

    constructor(props: CreateAccountDTO) {
        this.email = props.email;
        this.name = props.name;
        this.password = props.password;
    }
}