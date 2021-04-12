import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { SrvError } from "../model/common/srv-error";
import { RicevutaAllegato } from "../model/ricevuta-allegato";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: 'root',
})
export class AllegatoService {
    constructor(
        private http: HttpClient,
        private config: ConfigService
    ) { }

    getRicevutaAllegato(idAllegato: number): Observable<RicevutaAllegato | SrvError> {
        const URL: string = this.config.getBEServer() + `/allegati/ricevuta/allegato/${idAllegato}`;
        return this.http.get<RicevutaAllegato>(URL).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        const err: SrvError = new SrvError();
        err.code = '' + error.status;
        err.detail = error.message;
        if (error.error instanceof ErrorEvent) {
            console.error('Errore client o di rete:', error.error.message);
        } else {
            console.error(
                `Errore di Backend, status code HTTP: ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(err);
    }

}