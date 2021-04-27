import { AttachmentType } from "../utils/constants/attachmentType";

export interface IAttachment {
    uuid: string;
    url: string;
    type: AttachmentType;
    height: number;
    width: number;
}