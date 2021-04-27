import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import { catchError, map } from 'rxjs/operators';
import { ServiceHelper } from './service.helper';
import { Subject } from 'rxjs';
import { HttpError } from '@app/shared/models/http-error';
import { AuthHttpClient } from './auth-http-client.service';
import { IAuthUser } from '@app/shared/models/auth-user';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private findUsersByEmailSource = new Subject<HttpResponse<IAuthUser[] | HttpError>>();
	findUsersByEmailData$ = this.findUsersByEmailSource.asObservable();

	private updateAvatarSource = new Subject<HttpResponse<string | HttpError>>();
	updateAvatarData$ = this.updateAvatarSource.asObservable();

	private updateUserSource = new Subject<HttpResponse<IAuthUser | HttpError>>();
	updateUserData$ = this.updateUserSource.asObservable();

	private getMyUserSource = new Subject<HttpResponse<IAuthUser | HttpError>>();
	getMyUserData$ = this.getMyUserSource.asObservable();

	private removeAvatarSource = new Subject<HttpResponse<any | HttpError>>();
	removeAvatarData$ = this.removeAvatarSource.asObservable();

	constructor(
		private http: AuthHttpClient,
		private serviceHelper: ServiceHelper,
    ) { }
    
	findUsersByEmail(email: string) {
		this.http.get<IAuthUser[]>(environment.api.findUsersByEmail.replace("{email}", email))
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'findUsersByEmail'))
			)
			.subscribe(response => {
				this.findUsersByEmailSource.next(response);
			});
	}

	updateAvatar(signedUrlUUID: string) {
		this.http.put<any>(environment.api.updateAvatar, { signedUrlUUID })
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'updateAvatar'))
			)
			.subscribe(response => {
				this.updateAvatarSource.next(response);
			});
	}

	updateUser(name: string, email: string) {
		this.http.put<IAuthUser>(environment.api.updateUserInfo, { name, email })
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'updateUser'))
			)
			.subscribe(response => {
				this.updateUserSource.next(response);
			});
	}

	getMyUser() {
		this.http.get<IAuthUser>(environment.api.getMyUserData)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'getMyUser'))
			)
			.subscribe(response => {
				this.getMyUserSource.next(response);
			});
	}

	removeAvatar() {
		this.http.delete<any>(environment.api.updateAvatar)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'removeAvatar'))
			)
			.subscribe(response => {
				this.removeAvatarSource.next(response);
			});
	}

}
