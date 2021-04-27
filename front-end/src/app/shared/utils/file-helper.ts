import { Injectable } from "@angular/core";
import { CommonFile } from "../models/common-file";
import { IFileDimensions } from "../models/file-dimensions";
import { AttachmentType } from "./constants/attachmentType";
import { FileTypeHelper } from "./file-type-helper";

@Injectable({
    providedIn: "root"
})
export class FileHelper {

    imageAllowedExts = [
        "jpg",
        "png",
        "jpeg",
        "gif",
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
    ];

    videoAllowedFiles = [
        "mp4",
        "webm",
        "avi",
        "ogg",
        "flv",
        "mpg",
        "mpeg",
        "m4v",
        "video/mp4",
        "video/webm",
        "video/avi",
        "video/ogg",
        "video/flv",
        "video/mpg",
        "video/mpeg",
        "video/m4v",
    ];

    constructor(
        private fileTypeHelper: FileTypeHelper,
    ) { }

    getFormattedFile(file: File): Promise<CommonFile> {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            const fileToSave = new CommonFile();
            reader.onload = async () => {

                const src = reader.result;
                fileToSave.src = src;
                fileToSave.name = file.name;
                fileToSave.type = file.type;
                fileToSave.file = file;
                fileToSave.size = file.size;
                fileToSave.ext = this.getFileExt(file.name);
                fileToSave.attachmentType = this.fileTypeHelper.getFileTypeByExt(fileToSave.ext);

                const fileType = this.fileTypeHelper.getFileTypeByUrl(file.name);

                if (fileType === AttachmentType.IMAGE) {
                    fileToSave.dimensions = await this.getImageDimensions(src as string);
                } else if (fileType === AttachmentType.VIDEO) {
                    fileToSave.dimensions = await this.getVideoDimensions(src as string);
                }

                console.log("file dimensions: ", fileToSave.dimensions);

                resolve(fileToSave);
            }
            if (file) {
                reader.readAsDataURL(file);
            } else {
                resolve(null);
            }
        })
    }

    getImageDimensions(url: string): Promise<IFileDimensions> {
        return new Promise((resolve, _) => {
            const img = new Image();
            img.onload = () => {
                const { height, width } = img;
                resolve({ height, width });
            }
            img.src = url;
        })
    }

    getVideoDimensions(url: string): Promise<IFileDimensions> {
        return new Promise((resolve, _) => {
            const video = document.createElement('video');
            video.addEventListener('loadedmetadata', event => {
                const { videoWidth: width, videoHeight: height } = video;
                resolve({ height, width });
            })
            video.src = url;
        })
    }

    getFileExt(name: string): string {
        const split = name.split(".");
        return split[split.length - 1];
    }

    isFileExtValid(file: CommonFile, allowedFiles: string[]): boolean {
        if (allowedFiles.length === 0) return true;

        const allowedFilesExtensions: string[] = [];
        const allowedFileTypes: string[] = [];

        for (let allowedFile of allowedFiles) {
            if (allowedFile.indexOf("/") > -1) {
                allowedFileTypes.push(allowedFile);
            } else {
                allowedFilesExtensions.push(allowedFile);
            }
        }

        const fileName = file.name.split(".");

        let fileExt;

        if (!fileName || fileName.length > 0) {
            fileExt = fileName[fileName.length - 1];
        }

        return allowedFilesExtensions.indexOf(fileExt) > -1 ||
            allowedFileTypes.indexOf(file.type) > -1;

    }

    isFileSizeValid(file: CommonFile, size = 10000000): boolean {
        return file.size <= size;
    }

}