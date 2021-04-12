import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoGenerali } from 'src/app/model/common/InfoGenerali';
import { Profilo } from 'src/app/model/common/profilo';
import { AuthService } from 'src/app/service/auth.service';
import { DomandaService } from 'src/app/service/domanda.service';
import { ProfileService } from 'src/app/service/profile.service';
import { CodiceDescrizioneIstruttoria } from '../../model/common/CodiceDescrizioneIstruttoria';
import { DomandeFilterCondizionePunteggio } from '../../model/common/DomandeFilterCondizionePunteggio';
import { SrvError } from '../../model/common/srv-error';
import { TestataDomandaCodPunteggio } from '../../model/common/Testata-domanda-cod-punteggio';
import { UserInfo } from '../../model/common/user-info';
import { IstruttoriaService } from '../../service/istruttoria.service';
import { LoginService } from '../../service/login.service';

@Component({
  selector: 'app-verifichesuccessive',
  templateUrl: './verifichesuccessive.component.html',
  styleUrls: ['./verifichesuccessive.component.css']
})
export class VerifichesuccessiveComponent implements OnInit {

  filtroVerificheSuccessive = new FormGroup({});
  defaultTipoVerifica: any;
  defaultSelectStato: string;
  user: UserInfo;
  verificheSuccessiveFilter: DomandeFilterCondizionePunteggio = new DomandeFilterCondizionePunteggio();
  codicePreventivo = 'S';
  verifiche: CodiceDescrizioneIstruttoria[];
  showTestata: boolean;
  statusSearch = false;
  cachingMode = false;
  testataDomande: TestataDomandaCodPunteggio[];
  readonly ALL = 'ALL';
  readonly DAI = 'DAI';
  readonly CON = 'CON';
  readonly INV = 'INV';
  codTipoIstruttoriaSelected = 'BIN';
  errorOnRicerca = false;
  errorLoadVerifiche = false;
  codProfilo: string;
  cfOperatore: string;
  error: SrvError;

  constructor(
    private loginService: LoginService,
    private istruttoriaService: IstruttoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private domandaService: DomandaService,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.showTestata = false;
    this.defaultTipoVerifica = null;
    this.defaultSelectStato = this.DAI;
    this.cachingMode = false;
    this.getVerificheSuccessive();
    this.filtroVerificheSuccessive.addControl('cognomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.filtroVerificheSuccessive.addControl('nomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.filtroVerificheSuccessive.addControl('codiceCondizionePunteggio', new FormControl('', [Validators.required]));
    this.filtroVerificheSuccessive.addControl('statoCondizionePunteggio', new FormControl('', [Validators.required]));
    this.filtroVerificheSuccessive.addControl('dataInizio', new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]));
    this.filtroVerificheSuccessive.addControl('dataFine', new FormControl('', [Validators.maxLength(10)]));

    if (!this.filtroVerificheSuccessive.get('dataInizio').value) {
      this.setDefaultDataInizio();
    }

    this.cfOperatore = sessionStorage.getItem("cfOperatore")
    this.codProfilo = sessionStorage.getItem("codProfilo")
    
    console.log("^^^ stampo :"+this.cfOperatore + " e " + this.codProfilo)

    const caching = this.route.snapshot.paramMap.get('caching');
    if (caching === 'caching') {
      console.log("^^^^^^ cashing")
      this.cachingMode = true;
      this.statusSearch = true;
      this.codTipoIstruttoriaSelected = this.istruttoriaService.codTipoIstruttoria;
      const ordineScuola: string = sessionStorage.getItem('ordineScuola');
      this.istruttoriaService.getDomandeForCondizionePunteggioChaching(ordineScuola, this.cfOperatore,this.codProfilo).subscribe({
        next: (response: Array<TestataDomandaCodPunteggio>) => {
          this.testataDomande = this.filterByStatoDomanda(response);
          this.showTestata = true;
          // this.showCriterio = false;
          // this.showRaggruppamenti = false;
          this.statusSearch = false;
          this.filtroVerificheSuccessive.invalid;
          console.log('RicercaDomande, domande trovate: ' + this.testataDomande.length);
        },
        error: (response: SrvError) => {
          console.log('Errore: ' + JSON.stringify(response));
          this.statusSearch = false;
          // gestione dell'errore, di fatto recuperabile soltanto in presenza di errori di rete/backend temporanei
          // trattandosi di un dato in sola lettura, una possibilità potrebbe essere il retry automatico trasparente
          // all'utente fatto dal service, pilotato da qui
          // sollevo il flag che informa la view di mantenersi nella modalità di invio richiesta di ricerca, preservando il filtro compilato
          this.showTestata = false;
          this.errorOnRicerca = true;
          setTimeout(() => {
            this.errorOnRicerca = false;
          }, 9000);
        },
      });
    }
  }

  get codiceCondizionePunteggio() {
    if (this.cachingMode) {
      return this.istruttoriaService.codiceCondizionePunteggioChaching;
    }
    const codiCondizione = this.filtroVerificheSuccessive.get('codiceCondizionePunteggio').value;
    for (const verfica of this.verifiche) {
      if (verfica.codice === codiCondizione) {
        this.codTipoIstruttoriaSelected = verfica.codTipoIstruttoria;
        break;
      }
    }
    return codiCondizione;
  }

  get statoCondizionePunteggio() {
    return this.filtroVerificheSuccessive.get('statoCondizionePunteggio').value;
  }

  get nomeMinore() {
    if (!this.filtroVerificheSuccessive || !this.filtroVerificheSuccessive.get('nomeMinore')) {
      return '';
    }
    return this.filtroVerificheSuccessive.get('nomeMinore').value;
  }

  get cognomeMinore() {
    if (!this.filtroVerificheSuccessive || !this.filtroVerificheSuccessive.get('cognomeMinore')) {
      return '';
    }
    return this.filtroVerificheSuccessive.get('cognomeMinore').value;
  }

  get dataInizio() {
    if (!this.filtroVerificheSuccessive || !this.filtroVerificheSuccessive.get('dataInizio')) {
      return '';
    }
    return this.filtroVerificheSuccessive.get('dataInizio').value;
  }

  get dataFine() {
    if (!this.filtroVerificheSuccessive || !this.filtroVerificheSuccessive.get('dataFine')) {
      return '';
    }
    return this.filtroVerificheSuccessive.get('dataFine').value;
  }

  get disabledButtonSearch() {
    if (this.filtroVerificheSuccessive.get('dataInizio').invalid) {
      return true;
    }

    if (this.filtroVerificheSuccessive.get('nomeMinore').invalid &&
      this.filtroVerificheSuccessive.get('cognomeMinore').invalid
    ) {
      return this.filtroVerificheSuccessive.get('codiceCondizionePunteggio').invalid ||
        this.filtroVerificheSuccessive.get('statoCondizionePunteggio').invalid ||
        this.filtroVerificheSuccessive.get('nomeMinore').invalid ||
        this.filtroVerificheSuccessive.get('cognomeMinore').invalid;
    } else {
      return !this.filtroVerificheSuccessive.valid;
    }
  }

  getVerificheSuccessive() {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.loginService.getUtenteLoggato()
      .subscribe({
        next: (data: UserInfo) => {
          this.user = data;
          this.istruttoriaService.getElencoCondizioni(ordineScuola, this.user.codFisc, this.codicePreventivo)
            .subscribe({
              next: (verifiche: Array<CodiceDescrizioneIstruttoria>) => {
                this.verifiche = verifiche;
              },
              error: () => {
                this.errorLoadVerifiche = true;
                setTimeout(() => {
                  this.errorLoadVerifiche = false;
                }, 9000);
              }
            });
        },
        error: (data: SrvError) => {
          console.log('Errore: ' + JSON.stringify(data));
          this.errorLoadVerifiche = true;
          setTimeout(() => {
            this.errorLoadVerifiche = false;
          }, 9000);
        }
      });
  }

  returnSearch() {
    this.showTestata = false;
  }

  get criterioCompilato() {
    if (this.cachingMode) {
      return this.istruttoriaService.getCriterioCompilatoChaching();
    }

    let context = '';
    const prefix = 'Filtro di ricerca impostato: [ ';
    context += 'Condizione punteggio = ' + this.descCodiceCondizionePunteggio;
    context += ', Stato condizione punteggio = ' + this.getDescStatoCondizionePunteggio();
    if (this.cognomeMinore != null && this.cognomeMinore.length !== 0) {
      context += ', cognome = ' + this.cognomeMinore;
    }
    if (this.nomeMinore != null && this.nomeMinore.length !== 0) {
      if (this.cognomeMinore === null || this.cognomeMinore === '') {
        context += ', nome = ' + this.nomeMinore;
      } else {
        context += ', nome = ' + this.nomeMinore;
      }
    }
    if (this.dataInizio != null && this.dataInizio.length !== 0) {
      context += ', dal = ' + formatDate(this.dataInizio, 'dd/MM/yyyy', 'en-US');
    }
    if (this.dataFine != null && this.dataFine.length !== 0) {
      context += ', al = ' + formatDate(this.dataFine, 'dd/MM/yyyy', 'en-US');
    }

    return prefix + context + ' ]';
  }

  get descCodiceCondizionePunteggio() {
    const codiCondizione = this.codiceCondizionePunteggio;
    if (this.verifiche) {
      for (const verfica of this.verifiche) {
        if (verfica.codice === codiCondizione) {
          return verfica.descrizione;
        }
      }
    }
    return '';
  }

  get statoDomandaCodice(): string {
    if (this.statoCondizionePunteggio === 'DAI') {
      return 'DA ISTRUIRE';
    } else if (this.statoCondizionePunteggio === 'CON') {
      return 'CONFERMATA';
    } else if (this.statoCondizionePunteggio === 'INV') {
      return 'INV';
    } else if (this.statoCondizionePunteggio === 'ALL') {
      return 'TUTTI';
    }
  }

  private getDescStatoCondizionePunteggio(): string {
    const codStatoCondizionePunteggio: string = this.filtroVerificheSuccessive.get('statoCondizionePunteggio').value;
    let result: string = '';
    if (codStatoCondizionePunteggio) {
      switch (codStatoCondizionePunteggio) {
        case 'DAI': {
          result = 'Da validare';
          break;
        }
        case 'ALL': {
          result = 'Tutti';
          break;
        }
        case 'CON': {
          result = 'Validata';
          break;
        }
        case 'INV': {
          result = 'Invalidata';
          break;
        }
      }
    }
    return result;
  }

  onSubmit() {
    this.statusSearch = true;
    this.showTestata = true;

    this.verificheSuccessiveFilter.cognomeMinore = this.cognomeMinore;
    this.verificheSuccessiveFilter.nomeMinore = this.nomeMinore;
    this.verificheSuccessiveFilter.statoCondizionePunteggio = this.statoCondizionePunteggio;
    this.verificheSuccessiveFilter.codiceCondizionePunteggio = this.codiceCondizionePunteggio;
    this.verificheSuccessiveFilter.dataInizio = this.dataInizio;
    this.verificheSuccessiveFilter.dataFine = this.dataFine;

   
    console.log('filtro ricerca = ' + JSON.stringify(this.verificheSuccessiveFilter));
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.istruttoriaService.getDomandeForCondizionePunteggio(
      ordineScuola,
      this.verificheSuccessiveFilter,
      this.criterioCompilato,
      this.codiceCondizionePunteggio,
      this.codTipoIstruttoriaSelected,
      this.cfOperatore,
      this.codProfilo
    ).subscribe({
      next: (response: Array<TestataDomandaCodPunteggio>) => {
        this.testataDomande = this.filterByStatoDomanda(response);
        this.showTestata = true;
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
        this.showTestata = false;
        this.statusSearch = false;
        this.errorOnRicerca = true;
        setTimeout(() => {
          this.errorOnRicerca = false;
        }, 9000);
      },
    });
  }

  onReset() {
    this.clearForm();
    this.filtroVerificheSuccessive.addControl('cognomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.filtroVerificheSuccessive.addControl('nomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.filtroVerificheSuccessive.addControl('codiceCondizionePunteggio', new FormControl('', [Validators.required]));
    this.filtroVerificheSuccessive.addControl('statoCondizionePunteggio', new FormControl('', [Validators.required]));
    this.filtroVerificheSuccessive.addControl('dataInizio', new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]));
    this.filtroVerificheSuccessive.addControl('dataFine', new FormControl('', [Validators.maxLength(10)]));
    this.defaultTipoVerifica = null;
    this.defaultSelectStato = this.DAI;
    this.setDefaultDataInizio();
  }

  private clearForm() {
    this.filtroVerificheSuccessive.removeControl('cognomeMinore');
    this.filtroVerificheSuccessive.removeControl('nomeMinore');
    this.filtroVerificheSuccessive.removeControl('codiceCondizionePunteggio');
    this.filtroVerificheSuccessive.removeControl('statoCondizionePunteggio');
    this.filtroVerificheSuccessive.removeControl('dataInizio');
    this.filtroVerificheSuccessive.removeControl('dataFine');
  }

  private setDefaultDataInizio() {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.getInfoGenerali(ordineScuola).subscribe({
      next: (response: InfoGenerali) => {
        let dataInizioDefault = response.dataInizioIscrizioniNidi;
        if (dataInizioDefault) {
          this.filtroVerificheSuccessive.get('dataInizio').setValue(dataInizioDefault);
        }
      }
    });
  }

  private filterByStatoDomanda(values: TestataDomandaCodPunteggio[]): TestataDomandaCodPunteggio[] {
    let result: TestataDomandaCodPunteggio[] = [];
    if (values) {
      for (let value of values) {
        if (
          value.statoDomandaCodice === 'INV' ||
          value.statoDomandaCodice === 'AMM' ||
          value.statoDomandaCodice === 'ACC' ||
          value.statoDomandaCodice === 'GRA'
        ) {
          result.push(value);
        }
      }
    }
    return result;
  }

 

}
