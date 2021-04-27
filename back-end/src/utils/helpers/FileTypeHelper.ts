import { FileType } from "../constants/fileType";

class FileTypeHelper {

    getFileTypeByUrl(url: string): FileType {
        const split = url.split(".");
        const ext = split[split.length - 1];
        return this.getFileTypeByExt(ext);
    }

    getFileTypeByExt(ext: string): FileType {
        switch (ext.toUpperCase()) {
            case "JPG":
            case "JPEG":
            case "PNG":
            case "GIF":
                return FileType.IMAGE;
            case "MP4":
            case "WEBM":
            case "AVI":
            case "OGG":
            case "FLV":
            case "MPG":
            case "MPEG":
            case "M4V":
                return FileType.VIDEO;
            default:
                return null;
        }
    }

}

export default new FileTypeHelper();