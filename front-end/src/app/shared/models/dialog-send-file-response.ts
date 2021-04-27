import { CommonFile } from "./common-file";
import { AttachmentType } from "../utils/constants/attachmentType";

export class DialogSendFileResponse {
    file: CommonFile;
    comment?: string;

    constructor(props: DialogSendFileResponse) {
        this.file = props.file;
        this.comment = props.comment;
    }
}