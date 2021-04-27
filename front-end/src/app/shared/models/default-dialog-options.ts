import { IDefaultDialogButton } from "./default-dialog-button";


export interface IDefaultDialogOptions {
    buttons?: IDefaultDialogButton[];
    afterClosed?: (value: any) => void;
}