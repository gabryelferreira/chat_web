import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRequestOptions } from './request-otions';
import { catchError } from 'rxjs/operators';
import { ServiceHelper } from './service.helper';

@Injectable({
    providedIn: 'root'
})
export class CustomHttpClient {

    constructor(private http: HttpClient, private serviceHelper: ServiceHelper,) { }

    /**
     * GET request
     * @param {string} endPoint it doesn't need / in front of the end point
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @param {string} api use if there is needed to send request to different back-end than the default one.
     * @returns {Observable<T>}
     */
    public get<T>(endPoint: string, options?: IRequestOptions): Observable<HttpResponse<T>> {
        return this.http.get<T>(endPoint, { ...options, observe: "response" });
    }

    /**
    * POST request
    * @param {string} endPoint end point of the api
    * @param {Object} params body of the request.
    * @param {IRequestOptions} options options of the request like headers, body, etc.
    * @returns {Observable<T>}
    */
    public post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<HttpResponse<T>> {
        return this.http.post<T>(endPoint, params, { ...options, observe: "response" });
    }

    /**
   * PATCH request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
    public patch<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<HttpResponse<T>> {
        return this.http.patch<T>(endPoint, params, { ...options, observe: "response" });
    }

    /**
     * PUT request
     * @param {string} endPoint end point of the api
     * @param {Object} params body of the request.
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<HttpResponse<T>> {
        return this.http.put<T>(endPoint, params, { ...options, observe: "response" });
    }

    /**
     * DELETE request
     * @param {string} endPoint end point of the api
     * @param {IRequestOptions} options options of the request like headers, body, etc.
     * @returns {Observable<T>}
     */
    public delete<T>(endPoint: string, options?: IRequestOptions): Observable<HttpResponse<T>> {
        return this.http.delete<T>(endPoint, { ...options, observe: "response" });
    }

}
