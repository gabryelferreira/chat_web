import { IDefaultDialogOptions } from "./default-dialog-options";

export class DialogAvisoData {
    title: string;
    subtitle?: string;
    options?: IDefaultDialogOptions;

    constructor(props: DialogAvisoData) {
        this.title = props.title;
        this.subtitle = props.subtitle;
        this.options = props.options;
    }
}