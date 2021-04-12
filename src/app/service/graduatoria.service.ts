import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserInfo } from 'src/app/model/common/user-info';
import { InfoCalcoloGraduatoria, ParamatriCalcoloGraduatoria } from '../model/calcolo-graduatoria';
import { CodiceDescrizione } from '../model/common/codice-descrizione';
import { GraduatorieFilter } from '../model/common/graduatorie-filter';
import { ParametriGraduatoria } from '../model/common/parametri-graduatoria';
import { SrvError } from '../model/common/srv-error';
import { DomandeScuolaResidenza } from '../model/domande-scuola-residenza';
import { ElencoPosti } from '../model/elenco-posti';
import { AmmissioniParam, AnnoScolastico, Classe, ClasseParam, InfoResidenzeForzate } from '../model/gestione-classi';
import { GraduatoriaApprovazione, GraduatoriaCompleta } from '../model/report-graduatoria';
import { TestataGraduatoria } from '../model/testata-graduatoria';
import { InfoStepGraduatoria } from '../model/visualizza-graduatoria';
import { ConfigService } from './config.service';
import { DecodificaService } from './decodifica.service';


@Injectable({
    providedIn: 'root',
    useFactory: 'loadData'
})
export class GraduatoriaService {
    utenteLoggato: UserInfo;

    constructor(
        private router: Router,
        private config: ConfigService,
        private decodificaService: DecodificaService,
        private http: HttpClient
    ) { }

    getParametriUltimaGraduatoria(codOrdineScuola: string): Observable<ParametriGraduatoria | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/graduatorie/graduatoria/anagrafica/ultima'
            : '/domande/materna/graduatorie/graduatoria/anagrafica/ultima';

        return this.http.get<ParametriGraduatoria>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    getParametriGraduatoria(codiceGraduatoria: string, codOrdineScuola: string): Observable<ParametriGraduatoria | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/graduatorie/graduatoria/anagrafica/'
            : '/domande/materna/graduatorie/graduatoria/anagrafica/';

        return this.http.get<ParametriGraduatoria>(this.config.getBEServer() + URL + codiceGraduatoria).pipe(catchError(this.handleError));
    }

    getElencoGraduatorie(codOrdineScuola: string): Observable<Array<CodiceDescrizione> | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/anagrafica-graduatorie'
            : '/domande/materna/anagrafica-graduatorie';

        return this.http.get<Array<CodiceDescrizione>>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    getElencoStepGraduatoria(codiceGraduatoria: string, codOrdineScuola: string): Observable<Array<CodiceDescrizione> | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/graduatorie/graduatoria/anagrafica/' + codiceGraduatoria + '/step'
            : '/domande/materna/graduatorie/graduatoria/anagrafica/' + codiceGraduatoria + '/step';

        return this.http.get<Array<CodiceDescrizione>>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    getInfoStepGraduatorie(codOrdineScuola: string): Observable<InfoStepGraduatoria[] | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/graduatorie/info-step'
            : '/domande/materna/graduatorie/info-step';

        return this.http.get<InfoStepGraduatoria[]>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    getInfoCalcoloGraduatoria(codOrdineScuola: string): Observable<InfoCalcoloGraduatoria | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/graduatorie/graduatoria/calcolo/info'
            : '/domande/materna/graduatorie/graduatoria/calcolo/info';

        return this.http.get<InfoCalcoloGraduatoria>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    inviaRichiestaCalcoloGraduatoria(
        codiceGraduatoria: string,
        codiceStatoGraduatoria: string,
        stepGraduatoria: number,
        codOrdineScuola: string,
        codiceStatoDaCalcolare: string
    ): Observable<string | SrvError> {
        let params: ParamatriCalcoloGraduatoria = new ParamatriCalcoloGraduatoria();

        params.codiceGraduatoria = codiceGraduatoria;
        params.codiceStatoGraduatoria = codiceStatoGraduatoria;
        params.stepGraduatoria = stepGraduatoria;
        params.codiceOrdineScuola = codOrdineScuola;
        params.codiceStatoDaCalcolare = codiceStatoDaCalcolare;

        return this.http.post<string>(
            this.config.getBEServer() + '/domande/graduatorie/graduatoria/calcolo', params)
            .pipe(catchError(this.handleError));
    }

    getElencoAnniScolastici(): Observable<AnnoScolastico[] | SrvError> {
        return this.http.get<AnnoScolastico[]>(this.config.getBEServer()
            + '/domande/graduatorie/anni-scolastici')
            .pipe(catchError(this.handleError));
    }

    getElencoClassi(codScuola: string, codOrdineScuola: string, codAnno: string): Observable<Classe[] | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? `/domande/nido/scuola/${codScuola}/anno/${codAnno}/classi`
            : `/domande/materna/scuola/${codScuola}/anno/${codAnno}/classi`;

        return this.http.get<Classe[]>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    inserisciClasse(params: ClasseParam, codOrdineScuola: string): Observable<number | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/scuole/classi/nuova-classe'
            : '/domande/materna/scuole/classi/nuova-classe';

        return this.http.post<number>(this.config.getBEServer() + URL, params).pipe(catchError(this.handleError));
    }

    modificaClasse(params: ClasseParam, codOrdineScuola: string): Observable<number | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/scuole/classi'
            : '/domande/materna/scuole/classi';

        return this.http.put<number>(this.config.getBEServer() + URL, params).pipe(catchError(this.handleError));
    }

    eliminaClasse(idClasse: number, codOrdineScuola: string): Observable<number | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? `/domande/nido/scuole/classi/${idClasse}`
            : `/domande/materna/scuole/classi/${idClasse}`;

        return this.http.delete<number>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    aggiornaFlagAmmissioni(idClasseList: number[], value: boolean): Observable<number | SrvError> {
        let params: AmmissioniParam = new AmmissioniParam();
        params.idClasseList = idClasseList;
        params.value = value;

        return this.http.put<number>(
            this.config.getBEServer() + '/domande/scuole/classi/ammissioni', params)
            .pipe(catchError(this.handleError));
    }

    ricercaGraduatorie(isDse: boolean, graduatorieFilter: GraduatorieFilter, codOrdineScuola: string): Observable<TestataGraduatoria[] | SrvError> {
        const encodedFilter: string = encodeURI(JSON.stringify(graduatorieFilter));
        console.log('filtro: ' + encodedFilter);

        let URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/'
            : '/domande/materna/';

        URL += isDse ? 'graduatorie/dse?filter=' : 'graduatorie?filter=';

        return this.http.get<Array<TestataGraduatoria>>(this.config.getBEServer() + URL + encodedFilter).pipe(catchError(this.handleError));
    }

    getResidenzeForzate(codOrdineScuola: string): Observable<InfoResidenzeForzate | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/graduatorie/report/residenze-forzate'
            : '/domande/materna/graduatorie/report/residenze-forzate';

        return this.http.get<InfoResidenzeForzate>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    getGraduatoriaCompleta(codOrdineScuola: string): Observable<GraduatoriaCompleta[] | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? '/domande/nido/graduatorie/report/graduatoria-completa'
            : '/domande/materna/graduatorie/report/graduatoria-completa';

        return this.http.get<GraduatoriaCompleta[]>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    getElencoPosti(codOrdineScuola: string): Observable<ElencoPosti[] | SrvError> {
        return this.http.get<ElencoPosti[]>(this.config.getBEServer()
            + `/domande/graduatorie/report/elenco-posti/${codOrdineScuola}`) //TODO da inserire il link corretto
            .pipe(catchError(this.handleError));
    }

    getDomandeScuolaResidenza(): Observable<DomandeScuolaResidenza[] | SrvError> {
        return this.http.get<DomandeScuolaResidenza[]>(this.config.getBEServer()
            + '/domande/graduatorie/report/domande-scuola-residenza')
            .pipe(catchError(this.handleError));
    }    

    getGraduatoriaApprovazione(codOrdineScuola: string, codiceGraduatoria: string, step: number, codiceStatoGraduatoria: string): Observable<GraduatoriaApprovazione[] | SrvError> {
        const URL = this.isNido(codOrdineScuola)
            ? `/domande/nido/graduatoria/${codiceGraduatoria}/step/${step}/stato-graduatoria/${codiceStatoGraduatoria}/report/graduatoria-approvazione`
            : `/domande/materna/graduatoria/${codiceGraduatoria}/step/${step}/stato-graduatoria/${codiceStatoGraduatoria}/report/graduatoria-approvazione`;

        return this.http.get<GraduatoriaApprovazione[]>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
    }

    // getter sulla proprietà con le info dell'utente loggato
    getUtenteLoggato(): Observable<UserInfo | SrvError> {
        return this.http.get<UserInfo>(this.config.getBEServer() + '/autorizzazione/currentUser');
    }

    private isNido(codOrdineScuola: string): boolean {
        return codOrdineScuola == 'NID';
    }

    private handleError(error: HttpErrorResponse) {
        const err: SrvError = new SrvError();
        err.code = '' + error.status;
        err.detail = error.message;

        // nel caso di errore di validazione error.error ha la stessa struttura di SrvError
        if (error.error && error.error.code) {
            // codice di errore di tipo VAL-*
            err.title = error.error.code;
        }

        if (error.error instanceof ErrorEvent) {
            // Errore client side o di rete => costruisco un oggetto di errore da restituire al componente
            // chiamante
            console.error('Errore client o di rete:', error.error.message);
        } else {
            // Il backend ha risposto con un codice di risposta di errore (4xx, 5xx, ...).
            // Il corpo della risposta potrebbe contenere informazioni utili per la gestione dell'errore
            // nel componente chiamante => le restituisco nell'oggetto di errore
            console.error(
                `Errore di Backend, status code HTTP: ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(err);
    }

}
