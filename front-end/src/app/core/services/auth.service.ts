import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CreateAccountDTO } from '@app/shared/models/dto/create-account.dto';
import { environment } from '@env/environment';
import { catchError, map } from 'rxjs/operators';
import { ServiceHelper } from './service.helper';
import { Subject } from 'rxjs';
import { CustomHttpClient } from './custom-http-client.service';
import { LoginDTO } from '@app/shared/models/dto/login.dto';
import { AuthUserDTO } from '@app/shared/models/dto/auth-user.dto';
import { HttpError } from '@app/shared/models/http-error';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private createAccountSource = new Subject<HttpResponse<AuthUserDTO| HttpError>>();
	createAccountData$ = this.createAccountSource.asObservable();

	private loginSource = new Subject<HttpResponse<AuthUserDTO | HttpError>>();
	loginData$ = this.loginSource.asObservable();

	constructor(
		private http: CustomHttpClient,
		private serviceHelper: ServiceHelper,
	) { }

	createAccount(user: CreateAccountDTO) {
		this.http.post<AuthUserDTO>(environment.api.criarConta, user)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'createAccount'))
			)
			.subscribe(response => {
				this.createAccountSource.next(response);
			});
	}

	login(user: LoginDTO) {
		this.http.post<AuthUserDTO>(environment.api.login, user)
			.pipe(
				catchError(this.serviceHelper.handleError<HttpError>(this.constructor.name, 'login'))
			)
			.subscribe(response => {
				this.loginSource.next(response);
			});
	}

}
