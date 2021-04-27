import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { environment } from "@env/environment";
import { tap, takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { Injectable, Sanitizer } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { MatSnackBar } from "@angular/material/snack-bar";
import { State, Store } from "@ngrx/store";
import { IAppState } from "@app/store/app.state";
import { RoomActions } from "@app/store/room/room.actions";
import { AuthActions } from "@app/store/auth/auth.actions";

@Injectable()
export class HttpCancelService {
    private cancelPendingRequests$ = new Subject<void>()

    constructor() { }

    /** Cancels all pending Http requests. */
    public cancelPendingRequests() {
        this.cancelPendingRequests$.next()
    }

    public onCancelPendingRequests() {
        return this.cancelPendingRequests$.asObservable()
    }

}

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(
        public router: Router,
        public snackBar: MatSnackBar,
        private httpCancelService: HttpCancelService,
        private state: State<IAppState>,
        private store: Store<IAppState>,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const state: IAppState = this.state.getValue();
        const accessToken = state.auth?.accessToken?.token;

        let headers: HttpHeaders;

        if (req.url.indexOf("amazonaws.com") > -1) {
            headers = new HttpHeaders({});
        }
        else if (accessToken) {
            headers = new HttpHeaders({
                Authorization: `Bearer ${accessToken}`
            })
        }

        const newReq = req.clone({ headers });

        return this.continueRequest(newReq, next);
    }

    private continueRequest(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            takeUntil(this.httpCancelService.onCancelPendingRequests())
            , tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && environment.debugApiResponse) {
                    // Printa o respone da chamada no console para fins de debug
                    var urlList = Object["values"](environment.api);
                    if (urlList.find(url => url === event.url)) {
                        console.log(`API Call (${event.status}): ${event.url}`);
                        console.log("API Response: ", { ...event }); // Spread Operator Shallow copy

                    }
                }
            }, (err: any) => this.unauthorizedAction(err)));
    }

    private unauthorizedAction(err: any) {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401 || err.status === 403) {
                console.log(`ERROR ${err.status} - Unauthorized`)
                if (err.url.indexOf("refresh-token") > -1
                    || err.url.indexOf("refresh_token") > -1) {
                    window.stop();
                    localStorage.clear();
                    this.store.dispatch(RoomActions.setInitialState());
                    this.store.dispatch(AuthActions.setData(null));
                    console.log("to aqui: ");
                    this.router.navigate(['/login']);
                }
            }
        }
    }
}
