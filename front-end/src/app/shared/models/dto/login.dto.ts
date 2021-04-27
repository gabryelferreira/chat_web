export class LoginDTO {
    email: string;
    password: string;

    constructor(props: LoginDTO) {
        this.email = props.email;
        this.password = props.password;
    }
}