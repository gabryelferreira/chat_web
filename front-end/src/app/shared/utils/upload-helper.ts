import { Injectable } from "@angular/core";
import { UploadService } from "@app/core/services/upload.service";
import { ISignedUrl } from "../models/signed-url";
import { CommonFile } from "../models/common-file";

@Injectable({
    providedIn: "root"
})
export class UploadHelper {

    constructor(
        private uploadService: UploadService,
    ) {}

    async upload(file: CommonFile): Promise<ISignedUrl> {
        const response = await this.uploadService.getSignedUrl(file.ext, file.dimensions);
        if (response.status !== 200) {
            throw new Error();
        }
        const signedUrl = response.body as ISignedUrl;
        const uploadResponse = await this.uploadService.uploadFileBySignedUrl(signedUrl.signedUrl, file.file);
        if (uploadResponse.status !== 200) {
            throw new Error();
        }
        return signedUrl;
    }

}