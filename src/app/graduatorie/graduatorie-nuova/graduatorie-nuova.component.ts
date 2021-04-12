import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { InfoCalcoloGraduatoria, InfoVerifiche } from 'src/app/model/calcolo-graduatoria';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { ParametriGraduatoria } from 'src/app/model/common/parametri-graduatoria';
import { SrvError } from 'src/app/model/common/srv-error';
import { DecodificaService } from 'src/app/service/decodifica.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-graduatorie-nuova',
  templateUrl: './graduatorie-nuova.component.html',
  styleUrls: ['./graduatorie-nuova.component.css']
})

export class GraduatorieNuovaComponent implements OnInit {

  // ordine scolastico di riferimento (Nidi o Materne), impostato in sessione all'accesso del BO
  ordineScuola: string;

  globalError: boolean = false;
  statusSearch: boolean = false;
  errorOnRicerca: boolean = false;
  calcolaGraduatoriaForm: FormGroup;
  codiceStatoDaCalcolare: string = null;
  guiErrorMessage: string = "";

  statiGraduatoria: CodiceDescrizione[] = [];

  // oggetto che incapsula l'ultimo stato calcolato della graduatoria
  ultimaGraduatoria: ParametriGraduatoria = new ParametriGraduatoria();

  // proprietà di decodifica per binding con la view (codice graduatoria e stato graduatoria)
  decodificaStatoGraduatoria: string;
  decodificaGraduatoria: string;

  // codice dello stato selezionato a video per il calcolo della graduatoria 
  flag_sceltaStatoDaCalcolare: boolean = true;

  // flag di controllo visibilità pulsante di calcolo graduatoria
  disabledButtonCalcola: boolean = false;

  // flag di controllo presenza condizioni perl'avvio del calcolo graduatoria (tutte le domande devono essere istruite)
  errorOnCheckAvvioCalcoloGraduatoria: boolean = false;

  // indica se è in corso un altro calcolo della graduatoria
  errorAltroCalcoloInCorso: boolean = false

  // errore se il flag ammissioni e' diverso da 'S'
  errorAmmissioni: boolean = false;

  // indica se l'utente deve selezionare un valore dalla combo degli stati da calcolare
  errorSelezioneStatoDaCalcolare: boolean = false;

  // info verifiche preventive non ancora validate
  infoVerifiche: InfoVerifiche[] = [];

  // numero domande non ancora istruite
  domandeNonIstruite: number = 0;

  constructor(
    private router: Router,
    private decodificaService: DecodificaService,
    private graduatoriaService: GraduatoriaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.statusSearch = false;
    this.errorAltroCalcoloInCorso = false;
    this.errorAmmissioni = false;
    this.errorOnCheckAvvioCalcoloGraduatoria = false;

    this.calcolaGraduatoriaForm = new FormGroup({});
    this.calcolaGraduatoriaForm.addControl('graduatoria', new FormControl('', []));
    this.calcolaGraduatoriaForm.addControl('step', new FormControl('', []));
    this.calcolaGraduatoriaForm.addControl('statoAttuale', new FormControl('', []));
    this.calcolaGraduatoriaForm.addControl('dataUltimoCalcolo', new FormControl('', []));
    this.calcolaGraduatoriaForm.addControl('statoDaCalcolare', new FormControl('', []));

    this.ordineScuola = sessionStorage.getItem('ordineScuola');

    this.graduatoriaService.getParametriUltimaGraduatoria(this.ordineScuola).subscribe({
      next: (response: ParametriGraduatoria) => {
        this.ultimaGraduatoria = response;

        // valorizzo proprietà di decodifica della graduatoria
        this.decodificaGraduatoria = response.codice + '-' + this.ordineScuola;

        // valorizzo proprietà con lo stato attuale della graduatoria
        this.decodificaStatoGraduatoria = this.decodificaService.getDecodificaStatoGraduatoria(this.ultimaGraduatoria.codiceStato);

        // valorizzo gli stati di calcolo graduatoria possibili
        this.initStatiDaCalcolare();
        console.log('Graduatorie, ultima graduatoria: ' + JSON.stringify(this.ultimaGraduatoria));
      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
        this.statusSearch = false;
        // gestione dell'errore, di fatto recuperabile soltanto in presenza di errori di rete/backend temporanei
        // trattandosi di un dato in sola lettura, una possibilità potrebbe essere il retry automatico trasparente
        // all'utente fatto dal service, pilotato da qui

        // utilizzo il title dell'errore valorizzato dal servizio BE assumendo che sia significativo per l'uente finale
        this.guiErrorMessage = "Attenzione: " + response.title;
        this.errorOnRicerca = true;
        setTimeout(() => {
          this.errorOnRicerca = false;
        }, 9000);
      },
    });
  }

  /**
   * Avvia il calcolo della graduatoria
   */
  calcolaGraduatoria(): void {
    this.errorAltroCalcoloInCorso = false;
    this.errorAmmissioni = false;
    this.errorOnCheckAvvioCalcoloGraduatoria = false;

    if (this.flag_sceltaStatoDaCalcolare) {
      if (this.calcolaGraduatoriaForm.get('statoDaCalcolare').value == null) {
        this.errorSelezioneStatoDaCalcolare = true;
        setTimeout(() => {
          this.errorSelezioneStatoDaCalcolare = false;
        }, 9000);

        return;
      }
    }

    this.statusSearch = true;

    this.graduatoriaService.getInfoCalcoloGraduatoria(this.ordineScuola).subscribe({
      next: (response: InfoCalcoloGraduatoria) => {
        this.infoVerifiche = response.verifichePreventivePendenti;
        this.domandeNonIstruite = response.domandeNonIstruite;
        if (
          response &&
          response.domandeNonIstruite === 0 &&
          response.verifichePreventivePendenti &&
          response.verifichePreventivePendenti.length === 0
        ) {
          this.graduatoriaService.inviaRichiestaCalcoloGraduatoria(
            this.ultimaGraduatoria.codice,
            this.getCodiceStatoIniziale(this.ultimaGraduatoria),
            this.ultimaGraduatoria.step,
            sessionStorage.getItem('ordineScuola'),
            this.calcolaGraduatoriaForm.get('statoDaCalcolare').value
          ).subscribe({
            next: (response: string) => {
              this.statusSearch = false;
              this.disabledButtonCalcola = true;
              this.errorOnCheckAvvioCalcoloGraduatoria = false;
            },
            error: (response: SrvError) => {
              console.log('Errore: ' + JSON.stringify(response));
              this.statusSearch = false;
              if (response.title.includes('VAL-GRA-006')) {
                this.errorAltroCalcoloInCorso = true;
              } else if (response.title.includes('VAL-GRA-007')) {
                this.errorAmmissioni = true;
              }
              else {
                this.disabledButtonCalcola = false;
                this.errorOnCheckAvvioCalcoloGraduatoria = true;
              }
            },
          });
        }
        else {
          this.statusSearch = false;
          this.disabledButtonCalcola = false;
          this.errorOnCheckAvvioCalcoloGraduatoria = true;
        }
      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
        this.statusSearch = false;
        this.disabledButtonCalcola = false;
        this.errorOnCheckAvvioCalcoloGraduatoria = true;
      }
    })
  }

  /**
   * link di ritorno alla chiusura della View
   */
  onClose(): void {
    this.router.navigate(['/graduatorie/GRA']);
  }

  /**
   * Metodo di definizione logica per la visualizzazione degli stati di graduatoria da calcolare in funzione
   * dello stato della graduatoria attuale
   */
  initStatiDaCalcolare(): void {
    // step viene visto come valore stringa (da capire), nei confronti utilizzare ==
    const step: number = this.ultimaGraduatoria.step;

    if (this.ultimaGraduatoria.codiceStato === 'CAL') {
      if (step == 1) {
        let cd: CodiceDescrizione = new CodiceDescrizione();
        cd.codice = 'PRO';
        cd.descrizione = this.ultimaGraduatoria.step + "-" + this.decodificaService.getDecodificaStatoGraduatoria(cd.codice);
        this.statiGraduatoria.push(cd);
      }

      if (this.isNuovoStep(this.ultimaGraduatoria)) {
        let cd: CodiceDescrizione = new CodiceDescrizione();
        cd.codice = "DEF";
        cd.descrizione = this.ultimaGraduatoria.step + "-" + this.decodificaService.getDecodificaStatoGraduatoria("DEF") + "-nuovo step";
        this.statiGraduatoria.push(cd);
      }
      return;
    }

    if (this.ultimaGraduatoria.codiceStato === 'PRO') {
      let cd: CodiceDescrizione = new CodiceDescrizione();
      cd.codice = "PRO";
      cd.descrizione = this.ultimaGraduatoria.step + "-" + this.decodificaService.getDecodificaStatoGraduatoria(cd.codice);
      this.statiGraduatoria.push(cd);

      if (step == 1) {
        let cd: CodiceDescrizione = new CodiceDescrizione();
        cd.codice = "PRO_CON";
        cd.descrizione = this.ultimaGraduatoria.step + "-" + this.decodificaService.getDecodificaStatoGraduatoria(cd.codice);
        this.statiGraduatoria.push(cd);
      }
      return;
    }

    if (this.ultimaGraduatoria.codiceStato === 'PRO_CON') {
      if (step == 1) {
        let cd: CodiceDescrizione = new CodiceDescrizione();
        cd.codice = "DEF";
        cd.descrizione = this.ultimaGraduatoria.step + "-" + this.decodificaService.getDecodificaStatoGraduatoria(cd.codice);
        this.statiGraduatoria.push(cd);
      }
      return;
    }

    if (this.ultimaGraduatoria.codiceStato === 'DEF') {
      let cd: CodiceDescrizione = new CodiceDescrizione();
      cd.codice = "DEF";
      cd.descrizione = this.ultimaGraduatoria.step + "-" + this.decodificaService.getDecodificaStatoGraduatoria(cd.codice) + "-ammissioni";
      this.statiGraduatoria.push(cd);
      return;
    }

    if (this.ultimaGraduatoria.codiceStato === 'PUB') {
      let cd: CodiceDescrizione = new CodiceDescrizione();
      cd.codice = "PUB";
      cd.descrizione = this.ultimaGraduatoria.step + "-" + this.decodificaService.getDecodificaStatoGraduatoria(cd.codice) + "-ammissioni";
      this.statiGraduatoria.push(cd);
      return;
    }
  }

  private getCodiceStatoIniziale(ultimaGraduatoria: ParametriGraduatoria): string {
    // quando si passa ad un nuovo step (in base alla data) il backend non vedendo alcun
    // record sulla tabella iscritto_t_step_gra_con restituisce di default il codice stato CAL.
    // La creazione di un nuovo step lato backend è gestita come passaggio dallo stato PUB a DEF
    if (ultimaGraduatoria.codiceStato === 'CAL' && this.isNuovoStep(ultimaGraduatoria)) {
      return 'PUB';
    }

    return ultimaGraduatoria.codiceStato;
  }

  private isNuovoStep(ultimaGraduatoria: ParametriGraduatoria): boolean {
    if (ultimaGraduatoria) {
      const step: number = ultimaGraduatoria.step;
      const dataUltimoCalcolo: string = ultimaGraduatoria.dataUltimoCalcolo;

      return step > 1 && this.isBlank(dataUltimoCalcolo);
    }
    return false;
  }

  private isBlank(value: string): boolean {
    if (value == null || value.trim().length === 0) {
      return true;
    }

    return false;
  }

}
