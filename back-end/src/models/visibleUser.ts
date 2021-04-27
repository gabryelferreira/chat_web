export class VisibleUser {
    uuid: string;
    email: string;
    name: string;
    imgUrl: string;

    constructor(props: VisibleUser) {
        this.uuid = props.uuid;
        this.email = props.email;
        this.name = props.name;
        this.imgUrl = props.imgUrl;
    }
}

export interface OverrideVisibleUser {
    uuid?: string;
    email?: string;
    name?: string;
    imgUrl?: string;
}