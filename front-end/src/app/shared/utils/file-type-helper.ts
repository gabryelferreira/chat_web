import { AttachmentType } from "./constants/attachmentType";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class FileTypeHelper {

    getFileTypeByUrl(url: string): AttachmentType {
        const split = url.split(".");
        const ext = split[split.length - 1];
        return this.getFileTypeByExt(ext);
    }

    getFileTypeByExt(ext: string): AttachmentType {
        switch (ext.toUpperCase()) {
            case "JPG":
            case "JPEG":
            case "PNG":
            case "GIF":
                return AttachmentType.IMAGE;
            case "MP4":
            case "WEBM":
            case "AVI":
            case "OGG":
            case "FLV":
            case "MPG":
            case "MPEG":
            case "M4V":
                return AttachmentType.VIDEO;
            default:
                return null;
        }
    }

}