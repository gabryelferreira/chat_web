import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError } from 'rxjs/operators';
import { ServiceHelper } from './service.helper';
import { Subject } from 'rxjs';
import { HttpError } from '@app/shared/models/http-error';
import { AuthHttpClient } from './auth-http-client.service';
import { ISignedUrl } from '@app/shared/models/signed-url';
import { IFileDimensions } from '@app/shared/models/file-dimensions';

@Injectable({
	providedIn: 'root'
})
export class UploadService {

	constructor(
		private http: AuthHttpClient,
		private serviceHelper: ServiceHelper,
    ) { }

	getSignedUrl(fileExt: string, dimensions: IFileDimensions) {
		return this.http.get<ISignedUrl>(`${environment.api.signedUrl}?fileExt=${fileExt}&height=${dimensions?.height}&width=${dimensions?.width}`)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'getSignedUrl'))
			).toPromise();
	}

	uploadFileBySignedUrl(signedUrl: string, file: File) {
		return this.http.put<any>(signedUrl, file)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'uploadFileByPreSignedUrl'))
			).toPromise();
	}

}
