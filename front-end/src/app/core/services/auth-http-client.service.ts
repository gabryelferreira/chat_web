import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@env/environment';
import { catchError, flatMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { URLSearchParams } from '@angular/http';
import { IRequestOptions } from './request-otions';
import { ServiceHelper } from './service.helper';
import { CustomHttpClient } from './custom-http-client.service';
import { Store, State } from '@ngrx/store';
import { IAppState } from '@app/store/app.state';
import { AuthUtil } from '@app/shared/utils/auth-util';
import { IAuthState } from '@app/store/auth/auth.model';
import { AuthActions } from '@app/store/auth/auth.actions';
import { Router } from '@angular/router';
import { RoomActions } from '@app/store/room/room.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpClient {

    constructor(
        private http: CustomHttpClient,
        private snackBar: MatSnackBar,
        private serviceHelper: ServiceHelper,
        private store: Store<IAppState>,
        private authUtil: AuthUtil,
        private router: Router,
        private state: State<IAppState>,
    ) { }

    /**
     * GET request
     * @param {string} endPoint it doesn't need / in front of the end point
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @param {string} api use if there is needed to send request to different back-end than the default one.
     * @returns {Observable<T>}
     */
    public get<T>(endPoint: string, options?: IRequestOptions): Observable<HttpResponse<T>> {
        if (this.isTokenExpired()) {
            return new Observable<HttpResponse<T>>(subscriber => {
                this.http.post<IAuthState>(environment.api.refreshToken, this.getRefreshTokenParams())
                        .pipe(
                            catchError(this.serviceHelper.handleError(this.constructor.name, 'refreshToken'))
                        ).subscribe(response => {
                            if (response.status === 200) {
                                this.handleTokenResponse(response.body as IAuthState);
                                this.http.get<T>(endPoint, options).subscribe(response => {
                                    return subscriber.next(response);
                                });
                            } else {
                                this.handleTokenError();
                            }
                        });
            })
        } else {
            return this.http.get<T>(endPoint, options);
        }
    }

    /**
    * POST request
    * @param {string} endPoint end point of the api
    * @param {Object} params body of the request.
    * @param {IRequestOptions} options options of the request like headers, body, etc.
    * @returns {Observable<T>}
    */
    public post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<HttpResponse<T>> {
        if (this.isTokenExpired()) {
            return new Observable<HttpResponse<T>>(subscriber => {
                this.http.post<IAuthState>(environment.api.refreshToken, this.getRefreshTokenParams())
                        .pipe(
                            catchError(this.serviceHelper.handleError(this.constructor.name, 'refreshToken'))
                        ).subscribe(response => {
                            if (response.status === 200) {
                                this.handleTokenResponse(response.body as IAuthState);
                                this.http.post<T>(endPoint, params, options).subscribe(response => {
                                    return subscriber.next(response);
                                });
                            } else {
                                this.handleTokenError();
                            }
                        });
            })
        } else {
            return this.http.post<T>(endPoint, params, options);
        }
    }

    /**
   * PATCH request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
    public patch<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<HttpResponse<T>> {
        if (this.isTokenExpired()) {
            return new Observable<HttpResponse<T>>(subscriber => {
                this.http.post<IAuthState>(environment.api.refreshToken, this.getRefreshTokenParams())
                        .pipe(
                            catchError(this.serviceHelper.handleError(this.constructor.name, 'refreshToken'))
                        ).subscribe(response => {
                            if (response.status === 200) {
                                this.handleTokenResponse(response.body as IAuthState);
                                this.http.patch<T>(endPoint, params, options).subscribe(response => {
                                    return subscriber.next(response);
                                });
                            } else {
                                this.handleTokenError();
                            }
                        });
            })
        } else {
            return this.http.patch<T>(endPoint, params, options);
        }
    }

    /**
     * PUT request
     * @param {string} endPoint end point of the api
     * @param {Object} params body of the request.
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<HttpResponse<T>> {
        if (this.isTokenExpired()) {
            return new Observable<HttpResponse<T>>(subscriber => {
                this.http.post<IAuthState>(environment.api.refreshToken, this.getRefreshTokenParams())
                        .pipe(
                            catchError(this.serviceHelper.handleError(this.constructor.name, 'refreshToken'))
                        ).subscribe(response => {
                            if (response.status === 200) {
                                this.handleTokenResponse(response.body as IAuthState);
                                this.http.put<T>(endPoint, params, options).subscribe(response => {
                                    return subscriber.next(response);
                                });
                            } else {
                                this.handleTokenError();
                            }
                        });
            })
        } else {
            return this.http.put<T>(endPoint, params, options);
        }
    }

    /**
     * DELETE request
     * @param {string} endPoint end point of the api
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public delete<T>(endPoint: string, options?: IRequestOptions): Observable<HttpResponse<T>> {
        if (this.isTokenExpired()) {
            return new Observable<HttpResponse<T>>(subscriber => {
                this.http.post<IAuthState>(environment.api.refreshToken, this.getRefreshTokenParams())
                        .pipe(
                            catchError(this.serviceHelper.handleError(this.constructor.name, 'refreshToken'))
                        ).subscribe(response => {
                            if (response.status === 200) {
                                this.handleTokenResponse(response.body as IAuthState);
                                this.http.delete<T>(endPoint, options).subscribe(response => {
                                    return subscriber.next(response);
                                });
                            } else {
                                this.handleTokenError();
                            }
                        });
            })
        } else {
            return this.http.delete<T>(endPoint, options);
        }
    }

    private isTokenExpired(): boolean {
        const minutosRestantes = this.authUtil.getMinutosRestantesToken();
        return !minutosRestantes || minutosRestantes < 5;
    }

    private handleTokenResponse(response: IAuthState) {
        const authData: IAuthState = {
			...response,
		}
		
		authData.accessToken.expirationDate = this.authUtil.getExpirationDate(response.accessToken.expiresIn);
		authData.refreshToken.expirationDate = this.authUtil.getExpirationDate(response.refreshToken.expiresIn);
        this.store.dispatch(AuthActions.setData(response));
    }

    private handleTokenError() {
        localStorage.clear();
        this.store.dispatch(RoomActions.setInitialState());
        this.store.dispatch(AuthActions.setData(null));
        this.router.navigate(['/login']);
    }

    private getRefreshTokenParams(): any {
        let authUser = JSON.parse(localStorage.getItem("user-data-string"));
        const state: IAppState = this.state.getValue();
        const auth = state.auth;

        const body = {
            refreshToken: auth.refreshToken.token,
        }

        return body;
    }

}
