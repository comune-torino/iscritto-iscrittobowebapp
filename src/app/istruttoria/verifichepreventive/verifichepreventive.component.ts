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
  selector: 'app-verifichepreventive',
  templateUrl: './verifichepreventive.component.html',
  styleUrls: ['./verifichepreventive.component.css']
})
export class VerifichepreventiveComponent implements OnInit {

  codProfilo: string;
  cfOperatore: string;
  error: SrvError;
  FiltroVerifichePreventive = new FormGroup({});
  defaultTipoVerifica: any;
  defaultSelectStato: string;
  user: UserInfo;
  verifichePreventiveFilter: DomandeFilterCondizionePunteggio = new DomandeFilterCondizionePunteggio();
  codicePreventivo = 'P';
  verifiche: CodiceDescrizioneIstruttoria[];
  showTestata: boolean;
  statusSearch = false;
  testataDomande: TestataDomandaCodPunteggio[];
  cachingMode = false;
  codTipoIstruttoriaSelected: string;
  errorOnRicerca = false;
  errorLoadVerifiche = false;
  readonly ALL = 'ALL';
  readonly DAI = 'DAI';
  readonly CON = 'CON';
  readonly INV = 'INV';

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private istruttoriaService: IstruttoriaService,
    private router: Router,
    private domandaService: DomandaService,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.showTestata = false;
    this.defaultTipoVerifica = null;
    this.defaultSelectStato = this.DAI;
    this.getVerifichePreventive();
    this.cachingMode = false;
    this.FiltroVerifichePreventive.addControl('cognomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.FiltroVerifichePreventive.addControl('nomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.FiltroVerifichePreventive.addControl('codiceCondizionePunteggio', new FormControl('', [Validators.required]));
    this.FiltroVerifichePreventive.addControl('statoCondizionePunteggio', new FormControl('', [Validators.required]));
    this.FiltroVerifichePreventive.addControl('dataInizio', new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]));
    this.FiltroVerifichePreventive.addControl('dataFine', new FormControl('', [Validators.maxLength(10)]));

    if (!this.FiltroVerifichePreventive.get('dataInizio').value) {
      this.setDefaultDataInizio();
    }
    
    this.cfOperatore = sessionStorage.getItem("cfOperatore")
    this.codProfilo = sessionStorage.getItem("codProfilo")
    
    console.log("^^^ stampo :"+this.cfOperatore + " e " + this.codProfilo)

    console.log('Caching path: ' + this.route.queryParams);
    const caching =
      this.route.snapshot.paramMap.get('caching');
    if (caching === 'caching') {
      this.cachingMode = true;
      this.statusSearch = true;
      this.codTipoIstruttoriaSelected = this.istruttoriaService.codTipoIstruttoria;
      const ordineScuola: string = sessionStorage.getItem('ordineScuola');
      this.istruttoriaService.getDomandeForCondizionePunteggioChaching(ordineScuola, this.cfOperatore,this.codProfilo).subscribe({
        next: (response: Array<TestataDomandaCodPunteggio>) => {
          this.testataDomande = this.filterByStatoCondizionePunteggio(this.filterByStatoDomanda(response));
          this.showTestata = true;
          // this.showCriterio = false;
          // this.showRaggruppamenti = false;
          this.statusSearch = false;
          this.FiltroVerifichePreventive.invalid;
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
    const codiCondizione = this.FiltroVerifichePreventive.get('codiceCondizionePunteggio').value;
    for (const verfica of this.verifiche) {
      if (verfica.codice === codiCondizione) {
        this.codTipoIstruttoriaSelected = verfica.codTipoIstruttoria;
        break;
      }
    }
    return codiCondizione;
  }

  get statoCondizionePunteggio() {
    return this.FiltroVerifichePreventive.get('statoCondizionePunteggio').value;
  }

  get nomeMinore() {
    if (!this.FiltroVerifichePreventive || !this.FiltroVerifichePreventive.get('nomeMinore')) {
      return '';
    }
    return this.FiltroVerifichePreventive.get('nomeMinore').value;
  }

  get cognomeMinore() {
    if (!this.FiltroVerifichePreventive || !this.FiltroVerifichePreventive.get('cognomeMinore')) {
      return '';
    }
    return this.FiltroVerifichePreventive.get('cognomeMinore').value;
  }

  get dataInizio() {
    if (!this.FiltroVerifichePreventive || !this.FiltroVerifichePreventive.get('dataInizio')) {
      return '';
    }
    return this.FiltroVerifichePreventive.get('dataInizio').value;
  }

  get dataFine() {
    if (!this.FiltroVerifichePreventive || !this.FiltroVerifichePreventive.get('dataFine')) {
      return '';
    }
    return this.FiltroVerifichePreventive.get('dataFine').value;
  }

  get disabledButtonSearch() {
    if (this.FiltroVerifichePreventive.get('dataInizio').invalid) {
      return true;
    }

    if (this.FiltroVerifichePreventive.get('nomeMinore').invalid &&
      this.FiltroVerifichePreventive.get('cognomeMinore').invalid
    ) {
      return this.FiltroVerifichePreventive.get('codiceCondizionePunteggio').invalid ||
        this.FiltroVerifichePreventive.get('statoCondizionePunteggio').invalid ||
        this.FiltroVerifichePreventive.get('nomeMinore').invalid ||
        this.FiltroVerifichePreventive.get('cognomeMinore').invalid;
    } else {
      return !this.FiltroVerifichePreventive.valid;
    }
  }

  onSubmit() {
    this.statusSearch = true;

    this.verifichePreventiveFilter.cognomeMinore = this.cognomeMinore;
    this.verifichePreventiveFilter.nomeMinore = this.nomeMinore;
    this.verifichePreventiveFilter.statoCondizionePunteggio = this.statoCondizionePunteggio;
    this.verifichePreventiveFilter.codiceCondizionePunteggio = this.codiceCondizionePunteggio;
    this.verifichePreventiveFilter.dataInizio = this.dataInizio;
    this.verifichePreventiveFilter.dataFine = this.dataFine;

    console.log('filtro ricerca = ' + JSON.stringify(this.verifichePreventiveFilter));
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.istruttoriaService.getDomandeForCondizionePunteggioIstruttoria(
      ordineScuola,
      this.verifichePreventiveFilter,
      this.criterioCompilato,
      this.codiceCondizionePunteggio,
      this.codTipoIstruttoriaSelected,
      this.cfOperatore,
      this.codProfilo
    ).subscribe({
      next: (response: Array<TestataDomandaCodPunteggio>) => {
        this.testataDomande = this.filterByStatoCondizionePunteggio(this.filterByStatoDomanda(response));
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

  getVerifichePreventive() {
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

  onReset() {
    this.clearForm();
    this.FiltroVerifichePreventive.addControl('cognomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.FiltroVerifichePreventive.addControl('nomeMinore', new FormControl('', [Validators.minLength(2), Validators.maxLength(16)]));
    this.FiltroVerifichePreventive.addControl('codiceCondizionePunteggio', new FormControl('', [Validators.required]));
    this.FiltroVerifichePreventive.addControl('statoCondizionePunteggio', new FormControl('', [Validators.required]));
    this.FiltroVerifichePreventive.addControl('dataInizio', new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]));
    this.FiltroVerifichePreventive.addControl('dataFine', new FormControl('', [Validators.maxLength(10)]));
    this.defaultTipoVerifica = null;
    this.defaultSelectStato = this.DAI;
    this.setDefaultDataInizio();
  }

  returnSearch() {
    this.showTestata = false;
    this.router.navigate(['/istruttoria/verifiche/preventive']);
  }

  private clearForm() {
    this.FiltroVerifichePreventive.removeControl('cognomeMinore');
    this.FiltroVerifichePreventive.removeControl('nomeMinore');
    this.FiltroVerifichePreventive.removeControl('codiceCondizionePunteggio');
    this.FiltroVerifichePreventive.removeControl('statoCondizionePunteggio');
    this.FiltroVerifichePreventive.removeControl('dataInizio');
    this.FiltroVerifichePreventive.removeControl('dataFine');
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
    const codStatoCondizionePunteggio: string = this.FiltroVerifichePreventive.get('statoCondizionePunteggio').value;
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

  private setDefaultDataInizio() {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.getInfoGenerali(ordineScuola).subscribe({
      next: (response: InfoGenerali) => {
        let dataInizioDefault = response.dataInizioIscrizioniNidi;
        if (dataInizioDefault) {
          this.FiltroVerifichePreventive.get('dataInizio').setValue(dataInizioDefault);
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

  private filterByStatoCondizionePunteggio(values: TestataDomandaCodPunteggio[]): TestataDomandaCodPunteggio[] {
    let result: TestataDomandaCodPunteggio[] = [];
    const isDaValidare: boolean = this.FiltroVerifichePreventive.get('statoCondizionePunteggio').value == 'DAI';

    if (values) {
      result = isDaValidare ? values.filter(x => x.statoDomandaCodice === 'INV') : values;
    }

    return result;
  }


}
