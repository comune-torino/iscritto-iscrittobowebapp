import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Allegato } from '../model/common/Allegato';
import { CodiceDescrizione } from '../model/common/codice-descrizione';
import { CommissioneH } from '../model/common/CommissioneH';
import { DomandeFilter } from '../model/common/domande-filter';
import { DomandeFilterCondizionePunteggio } from '../model/common/DomandeFilterCondizionePunteggio';
import { FunzioneSocioSanitariaPost } from '../model/common/FunzioneSocioSanitariaPost';
import { FunzioneVariazionePost } from '../model/common/FunzioneVariazionePost';
import { SrvError } from '../model/common/srv-error';
import { StoricoVariazione } from '../model/common/StoricoVariazione';
import { TestataDomandaCodPunteggio } from '../model/common/Testata-domanda-cod-punteggio';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class IstruttoriaService {

  istruttoriaFilterCaching: DomandeFilter = new DomandeFilter;
  criterioCompilatoChaching: string;
  codiceCondizionePunteggioChaching: string;
  codTipoIstruttoriaChaching: string;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) { }

  getElencoCondizioni(codOrdineScuola: string, cfOperatore: string, tipologiaVerifica: string): Observable<Array<CodiceDescrizione> | SrvError> {
    const URL = this.isNido(codOrdineScuola)
      ? `/autorizzazione/nido/elenco-condizioni-punteggio/${cfOperatore}/${tipologiaVerifica}`
      : `/autorizzazione/materna/elenco-condizioni-punteggio/${cfOperatore}/${tipologiaVerifica}`;

    return this.http.get<Array<CodiceDescrizione>>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
  }

  getCriterioCompilatoChaching() {
    return this.criterioCompilatoChaching;
  }

  getDomandeForCondizionePunteggio(
    codOrdineScuola: string,
    domandeFilter: DomandeFilterCondizionePunteggio,
    criterioCompilato: string,
    codiceCondizionePunteggio: string,
    codTipoIstruttoria: string,
    cfOperatore: string,
    codProfilo: string
  ): Observable<Array<TestataDomandaCodPunteggio> | SrvError> {
    const encodedFilter: string = encodeURI(JSON.stringify(domandeFilter));
    this.criterioCompilatoChaching = criterioCompilato;
    this.istruttoriaFilterCaching = domandeFilter;
    this.criterioCompilatoChaching = criterioCompilato;
    this.istruttoriaFilterCaching = domandeFilter;
    this.codiceCondizionePunteggioChaching = codiceCondizionePunteggio;
    this.codTipoIstruttoriaChaching = codTipoIstruttoria;
    console.log('filtro: ' + encodedFilter);

    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido/istruttoria/'
      : '/domande/materna/istruttoria/'

    return this.http.get<TestataDomandaCodPunteggio[]>(this.config.getBEServer() + URL + cfOperatore+ "/" + codProfilo + `/?filter=` +  encodedFilter  ).pipe(catchError(this.handleError));
  }

  get codiceCondizionePunteggio() {
    return this.codiceCondizionePunteggioChaching;
  }

  get codTipoIstruttoria() {
    return this.codTipoIstruttoriaChaching;
  }

  getDomandeForCondizionePunteggioIstruttoria(
    codOrdineScuola: string,
    domandeFilter: DomandeFilterCondizionePunteggio,
    criterioCompilato: string,
    codiceCondizionePunteggio: string,
    codTipoIstruttoria: string,
    cfOperatore: string,
    codProfilo: string
  ): Observable<Array<TestataDomandaCodPunteggio> | SrvError> {
    const encodedFilter: string = encodeURI(JSON.stringify(domandeFilter));
    this.criterioCompilatoChaching = criterioCompilato;
    this.istruttoriaFilterCaching = domandeFilter;
    this.codiceCondizionePunteggioChaching = codiceCondizionePunteggio;
    this.codTipoIstruttoriaChaching = codTipoIstruttoria;
    console.log('filtro: ' + encodedFilter);

    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido/istruttoria/'
      : '/domande/materna/istruttoria/';

    return this.http.get<TestataDomandaCodPunteggio[]>(this.config.getBEServer() + URL + cfOperatore+ "/" + codProfilo + `/?filter=` +  encodedFilter).pipe(catchError(this.handleError));
  }

  getDomandeForCondizionePunteggioChaching(codOrdineScuola: string,cfOperatore: string,codProfilo: string): Observable<Array<TestataDomandaCodPunteggio> | SrvError> {
    const encodedFilter: string = encodeURI(JSON.stringify(this.istruttoriaFilterCaching));
    console.log('filtro: ' + encodedFilter);

    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido/istruttoria/'
      : '/domande/materna/istruttoria/';

    return this.http.get<Array<TestataDomandaCodPunteggio>>(this.config.getBEServer() + URL + cfOperatore+ "/" + codProfilo + `/?filter=` +  encodedFilter).pipe(catchError(this.handleError));
  }

  getStoricoVariazioni(idDomanda: string, condizionePunteggio: string): Observable<Array<StoricoVariazione> | SrvError> {
    return this.http.get<Array<StoricoVariazione>>(this.config.getBEServer()
      + `/domande/domanda/${idDomanda}/istruttoria/condizioni/punteggio/${condizionePunteggio}/storico`)
      .pipe(catchError(this.handleError));
  }
  getCertificati(idDomanda: string, condizionePunteggio: string): Observable<Array<Allegato> | SrvError> {
    return this.http.get<Array<Allegato>>(this.config.getBEServer()
      + `/domande/domanda/${idDomanda}/istruttoria/condizioni/punteggio/${condizionePunteggio}/allegati`)
      .pipe(catchError(this.handleError));
  }

  funzioneVariazione(
    codOrdineScuola: string,
    funzioneVariazionePost: FunzioneVariazionePost,
    idDomanda: string,
    condizionePunteggio: string,
    count: number
  ): Observable<any> {
    const URL = this.isNido(codOrdineScuola)
      ? `/domande/nido/${idDomanda}/istruttoria/condizioni/punteggio/${condizionePunteggio}/modifica/${count}`
      : `/domande/materna/${idDomanda}/istruttoria/condizioni/punteggio/${condizionePunteggio}/modifica/${count}`;

    return this.http.post<any>(this.config.getBEServer() + URL, funzioneVariazionePost).pipe(
      map(
        data => {
          return data;
        }
      ), catchError(this.handleError));
  }

  funzioneSocioSanitaria(
    codOrdineScuola: string,
    funzioneSocioSanitariaPost: FunzioneSocioSanitariaPost,
    idDomanda: string,
    condizionePunteggio: string,
    count: number
  ): Observable<any> {
    const URL = this.isNido(codOrdineScuola)
      ? `/domande/nido/${idDomanda}/istruttoria/condizioni/punteggio/${condizionePunteggio}/modifica/${count}`
      : `/domande/materna/${idDomanda}/istruttoria/condizioni/punteggio/${condizionePunteggio}/modifica/${count}`;

    return this.http.post<any>(this.config.getBEServer() + URL, funzioneSocioSanitariaPost).pipe(
      map(
        data => {
          return data;
        }
      ), catchError(this.handleError));
  }

  public getFile(idDomanda: string, idAllegato: string, nameAllegato: string, codFiscaleRich: string): Observable<Allegato> {
    const opts = {
      headers: new HttpHeaders({
        'Accept': 'application/octet-stream',

      }),
      responseType: 'blob',
    };
    return this
      .http
      .get<Allegato>(
        `${this.config.getBEServer()}/allegati/${idDomanda}/${idAllegato}/${codFiscaleRich}`,
        // @ts-ignore 2345
        opts
      ).pipe(
        map((response: Blob) => {
          this.startBlobDownload(response, nameAllegato);
        },
          error => console.error(error, `error downloading ${idAllegato}`)
        )); // @ts-ignore
  }

  public startBlobDownload(dataBlob: Blob, suggestedFileName: string) {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // for IE
      window.navigator.msSaveOrOpenBlob(dataBlob, suggestedFileName);
    } else {
      // for Non-IE (chrome, firefox etc.)
      const urlObject = URL.createObjectURL(dataBlob);
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('href', urlObject);
      downloadLink.setAttribute('download', suggestedFileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      // cleanup
      downloadLink.setAttribute('href', null);
      URL.revokeObjectURL(urlObject);
    }
  }

  public commissioneH(codOrdineScuola: string, dataInizio: string, dataFine: string): Observable<Array<CommissioneH> | SrvError> {
    const URL = this.isNido(codOrdineScuola)
      ? `/domande/nido/istruttoria/verbali/commissione/H/`+ sessionStorage.getItem("codProfilo") + `/?dataInizio=${dataInizio}&dataFine=${dataFine}`
      : `/domande/materna/istruttoria/verbali/commissione/H/`+ sessionStorage.getItem("codProfilo") + `/?dataInizio=${dataInizio}&dataFine=${dataFine}`;

    return this.http.get<Array<CommissioneH>>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
  }

  public commissioneS(codOrdineScuola: string, dataInizio: string, dataFine: string): Observable<Array<CommissioneH> | SrvError> {
    const URL = this.isNido(codOrdineScuola)
      ? `/domande/nido/istruttoria/verbali/commissione/S/`+ sessionStorage.getItem("codProfilo") + `/?dataInizio=${dataInizio}&dataFine=${dataFine}`
      : `/domande/materna/istruttoria/verbali/commissione/S/`+ sessionStorage.getItem("codProfilo") + `/?dataInizio=${dataInizio}&dataFine=${dataFine}`;

    return this.http.get<Array<CommissioneH>>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
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
