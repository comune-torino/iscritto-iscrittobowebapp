import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnagraficaGraduatorie } from '../model/common/AnagraficaGradautorie';
import { CodiceDescrizione } from '../model/common/codice-descrizione';
import { DomandaNido, ElencoNidi } from '../model/common/domanda-nido';
import { DomandeFilter } from '../model/common/domande-filter';
import { Eta } from '../model/common/Eta';
import { FasceEta } from '../model/common/FasceEta';
import { InfoScuola } from '../model/common/info-scuola';
import { InfoGenerali } from '../model/common/InfoGenerali';
import { ScuoleFilter } from '../model/common/scuole-filter';
import { SrvError } from '../model/common/srv-error';
import { statoDomanda } from '../model/common/statoDomanda';
import { Step } from '../model/common/Step';
import { TestataDomanda, TestataDomandaDaVerificare } from '../model/common/testata-domanda';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root',
})

/*
La classe service con ruolo di business delegate sul backend REST delle domande d iscrizione dedicato al BO.
Implementa l'approccio "http-agnostic", cioè non espone ai componenti chiamanti lo strato di integrazione del
protocollo HTTP. Se necessario/utile può implementare una cache di dati, ad esempio per quelli immutabili nel ciclo di vita di una sessione
client di lavoro
*/
export class DomandaService {
  readonly STATO_SCUOLA_NON_AMMISSIBILE: string = 'NON_AMM';
  readonly STATO_SCUOLA_PENDENTE: string = 'PEN';
  readonly STATO_DOMANDA_INVIATA: string = 'INV';

  constructor(
    //private step: Step,
    private router: Router,
    private config: ConfigService,
    private http: HttpClient,
    public datepipe: DatePipe
  ) { }

  domandeFilterCaching: DomandeFilter = new DomandeFilter;
  criterioCompilatoChaching: string;

  /*
  Elenco fisso degli stati possibili di una domanda di iscrizione nel contesto del BO
  */
  getCriterioCompilatoChaching() {
    return this.criterioCompilatoChaching;
  }

  getStatiDomanda(): Observable<Array<CodiceDescrizione> | SrvError> {
    return this.http.get<Array<CodiceDescrizione>>(this.config.getBEServer() + '/domande/stati').pipe(catchError(this.handleError));
  }

  /**
   * chiamata al servizio rest che restituisce l'elenco delle scuole mappate sull'utente loggato (reperito server side)
   */
  getScuoleByUtente(codOrdineScuola: string): Observable<Array<InfoScuola> | SrvError> {
    const scuoleFilter: ScuoleFilter = new ScuoleFilter;
    scuoleFilter.codiceTipologiaScuola = codOrdineScuola;
    console.log('filtro di ricerca per le scuole: ' + JSON.stringify(scuoleFilter));

    const URL = '/scuole/currentUser?filter=';

    return this.http.get<Array<InfoScuola>>(
      this.config.getBEServer() + URL + encodeURI(JSON.stringify(scuoleFilter))
    ).pipe(catchError(this.handleError));
  }

  getScuoleNido(dataNascita: Date): Observable<InfoScuola[] | SrvError> {
    let URL = this.config.getBEServer() + '/scuole/nido';
    if (dataNascita) {
      URL += '?dataNascita=' + this.datepipe.transform(dataNascita, 'yyyy-MM-dd');
    }

    return this.http.get<InfoScuola[]>(URL).pipe(catchError(this.handleError));
  }

  getScuoleMaterna(dataNascita: Date, codAnno: string): Observable<InfoScuola[] | SrvError> {
    let URL = this.config.getBEServer() + `/scuole/materna/${codAnno}`;
    if (dataNascita) {
      URL += '?dataNascita=' + this.datepipe.transform(dataNascita, 'yyyy-MM-dd');
    }

    return this.http.get<InfoScuola[]>(URL).pipe(catchError(this.handleError));
  }

  getTipiFasceEta(): Observable<FasceEta[] | SrvError> {
    const URL = this.config.getBEServer() + `/domande/anagrafica/eta/tipi-fasce-eta`;
    return this.http.get<FasceEta[]>(URL).pipe(catchError(this.handleError));
  }

  getElencoAnagraficaStepGraduatoria(codOrdineScuola: string, codAnagraficaGra: string, codAnnoScolastico: string): Observable<Step[] | SrvError> {
    const URL = this.config.getBEServer() + `/domande/anagrafica/step/graduatoria/ordine-scuola/${codOrdineScuola}/codice-anagrafica/${codAnagraficaGra}/anno/${codAnnoScolastico}`;
    return this.http.get<Step[]>(URL).pipe(catchError(this.handleError));
  }

  getElencoAnagraficaEta(codOrdineScuola: string, codAnagraficaGra: string, codAnnoScolastico: string): Observable<Eta[] | SrvError> {
    const URL = this.config.getBEServer() + `/domande/anagrafica/eta/ordine-scuola/${codOrdineScuola}/codice-anagrafica/${codAnagraficaGra}/anno/${codAnnoScolastico}`;
    return this.http.get<Eta[]>(URL).pipe(catchError(this.handleError));
  }

  getAnagraficaGraduatoria(): Observable<AnagraficaGraduatorie[] | SrvError> {
    const URL = this.config.getBEServer() + `/domande/anagrafica/graduatorie`;
    return this.http.get<AnagraficaGraduatorie[]>(URL).pipe(catchError(this.handleError));
  }

  getEliminaStep(idStepGra: number): Observable<number | SrvError> {
    const URL = this.config.getBEServer() + `/domande/anagrafica/graduatoria/elimina-step-graduatoria/${idStepGra}`;
    return this.http.delete<number>(URL).pipe(catchError(this.handleError));
  }

  getEliminaEta(idEta: number): Observable<number | SrvError> {
    const URL = this.config.getBEServer() + `/domande/anagrafica/eta/elimina-anagrafica-eta/${idEta}`;
    return this.http.delete<number>(URL).pipe(catchError(this.handleError));
  }

  getPreferenzeScuole(idGraduatoria: number, idDomanda: number): Observable<statoDomanda[] | SrvError> {
    const URL = this.config.getBEServer() + `/domande/graduatorie/preferenze-scuole/${idGraduatoria}/domanda/${idDomanda}`;
    return this.http.get<statoDomanda[]>(URL).pipe(catchError(this.handleError));
  }

  insertScuolaFuoriTermine(codOrdineScuola: string, idDomanda: number, codScuola: string, codTipoFrequenza: string): Observable<void> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let URL: string = this.config.getBEServer();
    URL += this.isNido(codOrdineScuola)
      ? '/domande/nido'
      : '/domande/materna';

    URL += `/domanda/${idDomanda}/scuola/${codScuola}/tempo/${codTipoFrequenza}`;

    return this.http.post<any>(URL, null, httpOptions).pipe(catchError(this.handleError));
  }

  /*
  delega su metodo di backend che orchestra la ricerca domande per filtro e la decodifica del risultato in forma di testata
  */
  getDomandeChaching(codOrdineScuola: string): Observable<TestataDomanda[] | SrvError> {
    const encodedFilter: string = encodeURI(JSON.stringify(this.domandeFilterCaching));
    console.log('filtro: ' + encodedFilter);

    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido?filter='
      : '/domande/materna?filter=';

    return this.http.get<TestataDomanda[]>(this.config.getBEServer() + URL + encodedFilter).pipe(catchError(this.handleError));
  }

  getDomande(codOrdineScuola: string, domandeFilter: DomandeFilter, criterioCompilato: string): Observable<TestataDomanda[] | SrvError> {
    this.criterioCompilatoChaching = criterioCompilato;
    this.domandeFilterCaching = domandeFilter;
    const encodedFilter: string = encodeURI(JSON.stringify(domandeFilter));
    console.log('filtro: ' + encodedFilter);

    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido?filter='
      : '/domande/materna?filter=';

    return this.http.get<TestataDomanda[]>(this.config.getBEServer() + URL + encodedFilter).pipe(catchError(this.handleError));
  }

  public postFile(fileToUpload: File, idDomanda: string, idSoggetto: string,
    codTipologia: string, cfRichiedente: string, cfOperatore: string): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this
      .http.post<void>(
        this.config.getBEServer() + `/allegati/${idDomanda}/${idSoggetto}/${codTipologia}/${cfRichiedente}/${cfOperatore}`,
        formData
      ).pipe(catchError(this.handleError));
  }

  getDomandaById(codOrdineScuola: string, idDomanda: number): Observable<DomandaNido | SrvError> {
    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido/'
      : '/domande/materna/';

    return this.http.get<DomandaNido>(this.config.getBEServer() + URL + idDomanda).pipe(catchError(this.handleError));
  }

  public getInfoGenerali(codOrdineScuola: string): Observable<InfoGenerali | SrvError> {
    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido/info'
      : '/domande/materna/info';

    return this.http.get<InfoGenerali>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
  }

  public getDomandeDaVerificare(codOrdineScuola: string): Observable<Array<TestataDomandaDaVerificare> | SrvError> {
    const URL = this.isNido(codOrdineScuola)
      ? '/domande/nido/da-verificare/' + sessionStorage.getItem("codProfilo")
      : '/domande/materna/da-verificare/' + sessionStorage.getItem("codProfilo");

    return this.http.get<Array<TestataDomandaDaVerificare>>(this.config.getBEServer() + URL).pipe(catchError(this.handleError));
  }

  modificaStatoScuola(idGraduatoria: number, idStatoAttuale: number, idStatoRipristino: number): Observable<any | SrvError> {
    return this.http.post<any>(this.config.getBEServer() +
      '/domande/graduatorie/modifica-stato-scuola-preferenza/graduatoria/' + idGraduatoria + '/stato-attuale/' + idStatoAttuale + '/stato-ripristino/' + idStatoRipristino, null
    ).pipe(catchError(this.handleError));
  }

  public modificaStatoScuole(codOrdineScuola: string, idDomanda: string, statoDomanda: string, scuole: ElencoNidi[]): Observable<any> {
    if (scuole && scuole.length !== 0) {
      for (const scuola of scuole) {
        // considero solo gli stati pendente, non ammissibile e null
        if (scuola.codStatoScuola !== null && scuola.codStatoScuola !== this.STATO_SCUOLA_PENDENTE && scuola.codStatoScuola !== this.STATO_SCUOLA_NON_AMMISSIBILE) {
          continue;
        }

        if (scuola.ammissibile) {
          if (scuola.codStatoScuola === null || scuola.codStatoScuola === this.STATO_SCUOLA_PENDENTE) {
            continue;
          }

          if (scuola.codStatoScuola === this.STATO_SCUOLA_NON_AMMISSIBILE) {
            scuola.codStatoScuola = statoDomanda === this.STATO_DOMANDA_INVIATA ? null : this.STATO_SCUOLA_PENDENTE
          }
        }
        else {
          scuola.codStatoScuola = this.STATO_SCUOLA_NON_AMMISSIBILE;
        }
      }
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const URL = this.isNido(codOrdineScuola)
      ? `/domande/domanda/${idDomanda}/nidi/stato`
      : `/domande/domanda/${idDomanda}/materne/stato`;

    return this.http.post<any>(this.config.getBEServer() + URL, JSON.stringify(scuole), httpOptions).pipe(catchError(this.handleError));
  }

  private isNido(codOrdineScuola: string): boolean {
    return codOrdineScuola == 'NID';
  }

  private handleError(error: HttpErrorResponse) {
    const err: SrvError = new SrvError();
    err.code = '' + error.status;
    err.detail = error.message;
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
