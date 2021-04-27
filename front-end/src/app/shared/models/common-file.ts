import { AttachmentType } from "../utils/constants/attachmentType";
import { IFileDimensions } from "./file-dimensions";

export class CommonFile {
    src: string | ArrayBuffer;
    name: string;
    type: string;
    file: File;
    ext: string;
    size?: number;
    dimensions: IFileDimensions;
    attachmentType: AttachmentType;
}