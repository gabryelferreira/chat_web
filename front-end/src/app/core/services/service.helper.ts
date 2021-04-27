import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ServiceHelper {

    constructor(
        private snackBar: MatSnackBar,
    ) { }

    public handleError<T>(servico = 'servico', operation = 'operation') {
        return (error: HttpErrorResponse): Observable<HttpResponse<T>> => {
            // TODO: logar o erro em algum servidor
            console.error(error); // Por enquanto printa no console

            // Print do erro no console mais amigável
            console.log(`${servico}: `, `${operation} failed(status ${error.status}): ${error.statusText}`);

            const response = new HttpResponse({
                ...error,
                body: error.error,
            })

            // Continua a execução retornando um valor default
            return of(response as HttpResponse<T>);
        }
    };
}
