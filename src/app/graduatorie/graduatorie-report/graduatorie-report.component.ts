import { OrdineScuola } from './../../model/gestione-classi';
import { DomandeScuolaResidenza } from './../../model/domande-scuola-residenza';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { SrvError } from 'src/app/model/common/srv-error';
import { ElencoPosti } from 'src/app/model/elenco-posti';
import { InfoResidenzeForzate } from 'src/app/model/gestione-classi';
import { GraduatoriaApprovazione, GraduatoriaCompleta } from 'src/app/model/report-graduatoria';
import { InfoStepGraduatoria } from 'src/app/model/visualizza-graduatoria';
import { AuthService } from 'src/app/service/auth.service';
import { DecodificaService } from 'src/app/service/decodifica.service';
import { ExcelServiceService } from 'src/app/service/excel-service.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';

@Component({
  selector: 'app-graduatorie-report',
  templateUrl: './graduatorie-report.component.html',
  styleUrls: ['./graduatorie-report.component.css']
})
export class GraduatorieReportComponent implements OnInit {
  statusSearch: boolean = false;
  errors: boolean = false;
  errorMessage: string = '';
  cambioFascia: string = '';
  numeroProgressivo: number = 0;

  // stati visualizzazione
  viewReportResidenzeForzate: boolean = false;
  viewGraduatoriaCompleta: boolean = false;
  viewGraduatoriaApprovazione: boolean = false;
  viewElencoPosti: boolean = false;
  viewReportDomandeScuolaResidenza: boolean = false;

  // graduatoria approvazione
  graduatoriaApprovazioneForm: FormGroup = new FormGroup({});
  datiStepGraduatorie: InfoStepGraduatoria[] = [];
  elencoGraduatorie: CodiceDescrizione[] = [];
  graduatoriaSelezionata: CodiceDescrizione = new CodiceDescrizione();
  elencoStepGraduatoria: CodiceDescrizione[] = [];
  stepSelezionato: CodiceDescrizione = new CodiceDescrizione();
  elencoStatiGraduatoria: CodiceDescrizione[] = [];
  statoGraduatoriaSelezionato: CodiceDescrizione = new CodiceDescrizione();

  constructor(
    private router: Router,
    private graduatoriaService: GraduatoriaService,
    private excelService: ExcelServiceService,
    public datepipe: DatePipe,
    private decodificaService: DecodificaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.createForm();
    this.initInfoStepGraduatorie();

    this.showReportResidenzeForzate();
    this.showReportGraduatoriaCompleta();
    this.showReportGraduatoriaApprovazione();
    this.showReportElencoPosti();
    this.showReportDomandeScuolaResidenza();
  }

  onSelectGraduatoria(): void {
    this.initElencoStep(this.graduatoriaSelezionata.codice);
    this.setUltimoStep();
    this.initElencoStatiGraduatoria(this.graduatoriaSelezionata.codice, this.stepSelezionato.codice);
    this.setUltimoStatoGraduatoria();
  }

  onSelectStep(): void {
    this.initElencoStatiGraduatoria(this.graduatoriaSelezionata.codice, this.stepSelezionato.codice);
    this.setUltimoStatoGraduatoria();
  }

  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////
  showReportResidenzeForzate(): void {
    this.viewReportResidenzeForzate = true;
  }

  showReportGraduatoriaCompleta(): void {
    this.viewGraduatoriaCompleta = true;
  }

  showReportGraduatoriaApprovazione(): void {
    this.viewGraduatoriaApprovazione = true;
  }

  showReportElencoPosti(): void {
    this.viewElencoPosti = true;
  }

  showReportDomandeScuolaResidenza(): void {
    this.viewReportDomandeScuolaResidenza = true;
  }

  returnSearch(): void {
    this.router.navigate(['/graduatorie/GRA']);
  }

  //////////////////////////////////////////////////////////////////////
  // Getters
  //////////////////////////////////////////////////////////////////////
  get ordineScuola(): string {
    return sessionStorage.getItem('ordineScuola');
  }

  get graduatoriaApprovazioneDisponibile(): boolean {
    return this.elencoGraduatorie && this.elencoGraduatorie.length > 0;
  }

  //////////////////////////////////////////////////////////////////////
  // gestione report
  //////////////////////////////////////////////////////////////////////
  dowloadReportResidenzeForzate(): void {
    this.statusSearch = true;
    this.graduatoriaService.getResidenzeForzate(this.ordineScuola).subscribe({
      next: (response: InfoResidenzeForzate) => {
        if (response) {
          this.exportXlsResidenzeForzate(response);
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: si è verificato un errore durante la generazione del report.');
      },
    });
  }

  dowloadGraduatoriaCompleta(): void {
    this.statusSearch = true;
    this.graduatoriaService.getGraduatoriaCompleta(this.ordineScuola).subscribe({
      next: (response: GraduatoriaCompleta[]) => {
        if (response) {
          this.exportXlsGraduatoriaCompleta(response);
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: si è verificato un errore durante la generazione del report.');
      },
    });
  }

  dowloadElencoPosti(): void {
    this.statusSearch = true;
    this.graduatoriaService.getElencoPosti(this.ordineScuola).subscribe({
      next: (response: ElencoPosti[]) => {
        if (response) {
          this.exportXlsElencoPosti(response);
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: si è verificato un errore durante la generazione del report.');
      },
    });
  }

  downloadGraduatoriaApprovazione(): void {
    const codiceGraduatoria: string = this.graduatoriaSelezionata.codice;
    const descGraduatoria: string = this.graduatoriaSelezionata.descrizione;
    const step: number = Number(this.stepSelezionato.codice);
    const codiceStatoGraduatoria: string = this.statoGraduatoriaSelezionato.codice;

    this.statusSearch = true;

    console.log("ordine scuola: " + this.ordineScuola)
    console.log("cordice graduatoria " + codiceGraduatoria)
    console.log("step: " + step)
    console.log("codiceStatoGraduatoria: " + codiceStatoGraduatoria)

    this.graduatoriaService.getGraduatoriaApprovazione(this.ordineScuola, codiceGraduatoria, step, codiceStatoGraduatoria).subscribe({
      next: (response: GraduatoriaApprovazione[]) => {
        if (response) {
          this.exportXlsGraduatoriaApprovazione(response, descGraduatoria, step, codiceStatoGraduatoria, this.ordineScuola);
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: si è verificato un errore durante la generazione del report.');
      },
    });
  }

  dowloadDomandeScuolaResidenza(): void {
    this.statusSearch = true;
    this.graduatoriaService.getDomandeScuolaResidenza().subscribe({
      next: (response: DomandeScuolaResidenza[]) => {
        if (response) {
          this.exportXlsDomandeScuolaResidenza(response);
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: si è verificato un errore durante la generazione del report.');
      },
    });
  }

  //////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////
  private createForm(): void {
    this.graduatoriaApprovazioneForm = new FormGroup({});
    this.graduatoriaApprovazioneForm.addControl('graduatoria', new FormControl('', [Validators.required]));
    this.graduatoriaApprovazioneForm.addControl('step', new FormControl('', [Validators.required]));
    this.graduatoriaApprovazioneForm.addControl('statoGraduatoria', new FormControl('', [Validators.required]));
  }

  private initInfoStepGraduatorie(): void {
    this.statusSearch = true;
    this.graduatoriaService.getInfoStepGraduatorie(this.ordineScuola).subscribe({
      next: (response: InfoStepGraduatoria[]) => {
        this.statusSearch = false;
        this.datiStepGraduatorie = this.getGraduatorieValide(response);
        this.initElencoGraduatorie();
        if (this.elencoGraduatorie.length > 0) {
          this.setUltimaGraduatoria();
          this.initElencoStep(this.graduatoriaSelezionata.codice);
          this.setUltimoStep();
          this.initElencoStatiGraduatoria(this.graduatoriaSelezionata.codice, this.stepSelezionato.codice);
          this.setUltimoStatoGraduatoria();
        }
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: si è verificato un errore durante il caricamento dei dati.');
      },
    });
  }

  private initElencoGraduatorie(): void {
    this.elencoGraduatorie = [];
    let values: string[] = this.datiStepGraduatorie.map(item => item.codAnagraficaGra);
    values = values.filter((item, index) => values.indexOf(item) === index);
    values.forEach(item => {
      this.elencoGraduatorie.push({
        codice: item,
        descrizione: item + '-' + this.ordineScuola
      });
    });
  }

  private initElencoStep(codAnagraficaGra: string): void {
    this.elencoStepGraduatoria = [];
    const filtered: InfoStepGraduatoria[] = this.datiStepGraduatorie.filter(item => item.codAnagraficaGra == codAnagraficaGra);
    let values: number[] = filtered.map(item => item.step);
    values = values.filter((item, index) => values.indexOf(item) === index);
    values.forEach(item => {
      this.elencoStepGraduatoria.push({
        codice: item.toString(),
        descrizione: item.toString()
      });
    });
  }

  private initElencoStatiGraduatoria(codAnagraficaGra: string, step: string): void {
    this.elencoStatiGraduatoria = [];
    const filtered: InfoStepGraduatoria[] = this.datiStepGraduatorie.filter(
      item => item.codAnagraficaGra == codAnagraficaGra && String(item.step) == step
    );

    let values: string[] = filtered.map(item => item.codStatoGra);
    values = values.filter(item => {
      return item == 'PRO' || item == 'PRO_CON' || item == 'DEF' || item == 'DEF_CON';
    });

    values = values.filter((item, index) => values.indexOf(item) === index);

    const order: Map<string, number> = new Map([
      ['PRO', 1],
      ['PRO_CON', 2],
      ['DEF', 3],
      ['DEF_CON', 4]
    ]);

    values.sort((a: string, b: string): number => {
      if (order.has(a) && order.has(b)) {
        return order.get(a) - order.get(b);
      }
      return a.localeCompare(b);
    })

    values.forEach(item => {
      this.elencoStatiGraduatoria.push({
        codice: item,
        descrizione: this.decodificaService.getDecodificaStatoGraduatoria(item)
      });
    });
  }

  private getGraduatorieValide(values: InfoStepGraduatoria[]): InfoStepGraduatoria[] {
    let result: InfoStepGraduatoria[] = [];
    if (values) {
      for (let dsg of values) {
        if (dsg.dtStepCon) {
          result.push(dsg);
        }
      }
    }

    result = result.filter(item => {
      if (item.step == 1) {
        return item.codStatoGra == 'PRO' || item.codStatoGra == 'PRO_CON';
      }
      return item.codStatoGra == 'DEF' || item.codStatoGra == 'DEF_CON';
    });

    return result;
  }

  private setUltimaGraduatoria(): void {
    if (this.elencoGraduatorie.length > 0) {
      this.graduatoriaSelezionata = this.elencoGraduatorie[this.elencoGraduatorie.length - 1];
    }
  }

  private setUltimoStep(): void {
    if (this.elencoStepGraduatoria.length > 0) {
      this.stepSelezionato = this.elencoStepGraduatoria[(this.elencoStepGraduatoria.length - 1)];
    }
  }

  private setUltimoStatoGraduatoria(): void {
    if (this.elencoStatiGraduatoria.length > 0) {
      this.statoGraduatoriaSelezionato = this.elencoStatiGraduatoria[(this.elencoStatiGraduatoria.length - 1)];
    }
  }

  private showErrors(message: string, hide: boolean = true): void {
    this.errorMessage = message;
    this.errors = true;
    if (hide) {
      setTimeout(() => {
        this.errors = false;
      }, 9000);
    }
  }

  //////////////////////////////////////////////////////////////////////
  // Export xls
  //////////////////////////////////////////////////////////////////////
  private exportXlsResidenzeForzate(value: InfoResidenzeForzate): void {
    const now: string = this.datepipe.transform(new Date(), 'dd/MM/yyyy');

    if (value && value.residenzeForzate) {
      const json = value.residenzeForzate.map(rec => {
        return {
          'Protocollo': rec.protocollo,
          'Codice fiscale': rec.codiceFiscale,
          'Cognome': rec.cognome,
          'Nome': rec.nome,
          'Fascia età': this.decodificaService.getDecodificaFasceEta(rec.codFasciaEta),
          'Nido di ammissione': rec.descScuola + ' - ' + rec.indirizzo
        }
      });

      this.excelService.exportReportAsExcelFileWithRow(
        json,
        `Report residenze forzate generato il ${now}`,
        `residenze_forzate`);
    }
  }

  private exportXlsGraduatoriaCompleta(value: GraduatoriaCompleta[]): void {
    if (value) {
      const json = value.map(rec => {
        return {
          'Fascia età': this.decodificaService.getDecodificaFasceEta(rec.codFasciaEta),
          'Punteggio': rec.punteggio,
          'ISEE': rec.isee,
          'Data nascita': this.datepipe.transform(rec.dataNascita, 'dd/MM/yyyy') + ' ' + rec.oraNascita,
          'Data presentazione': this.datepipe.transform(rec.dataConsegna, 'dd/MM/yyyy'),
          'Protocollo': rec.protocollo,
          'Nome': rec.nome,
          'Cognome': rec.cognome,
          'Codice fiscale': rec.codiceFiscale,
          'Scelta 1': rec.pref1,
          'Scelta 2': rec.pref2,
          'Scelta 3': rec.pref3,
          'Scelta 4': rec.pref4,
          'Scelta 5': rec.pref5,
          'Scelta 6': rec.pref6,
          'Scelta 7': rec.pref7,
          'Scelta 8': rec.pref8,
          'Scelta 9': rec.pref9,
          'Scelta 10': rec.pref10,
        }
      });

      this.excelService.exportReportAsExcelFile(
        json,
        `graduatoria_completa`);
    }
  }

  private exportXlsElencoPosti(value: ElencoPosti[]): void {
    const now: string = this.datepipe.transform(new Date(), 'dd/MM/yyyy');

    if (value) {
      const json = value.map(rec => {
        let postiLib = Number(rec.postiLiberi);
        let postiAmm = Number(rec.postiAmmessi);

        return {
          'Ordine scuola': rec.codOrdineScuola,
          'Graduatoria': rec.codAnagraficaGraduatoria,
          'Prodotto il': this.datepipe.transform(rec.dataCreazione, 'dd/MM/yyyy'),
          'Codice scuola': rec.codScuola,
          'Indirizzo': rec.indirizzoScuola,
          'Fascia età': this.decodificaService.getDecodificaFasceEta(rec.descFasciaEta),
          'Tempo frequenza': rec.descTipoFrequenza,
          'Posti liberi': postiLib,
          'Posti ammessi': postiAmm
        }
      });

      this.excelService.exportReportAsExcelFile(
        json,
        `elenco_posti`);
    }
  }

  private exportXlsGraduatoriaApprovazione(value: GraduatoriaApprovazione[], graduatoria: string, step: number, statoGraduatoria: string, ordineScuola: string): void {

    if (value) {
      const json = value.map(rec => {
        const f = () => rec.flFuoriTermine;

        if (ordineScuola == "NID") {
          return {
            ' ': this.getNumeroProgressivo(rec.codFasciaEta),
            'Protocollo': rec.protocollo,
            'Priorità assoluta': this.getPriorita(rec.idDomandaIscrizione),
            'Punteggio': rec.punteggioPrimaScelta,
            'Punteggio 2': rec.punteggio,
            'ISEE': rec.isee,
            'Data_nascita/ora_nascita': this.datepipe.transform(rec.dataNascita, 'dd/MM/yyyy') + ' ' + rec.oraNascita,
            'Fascia di età': this.decodificaService.getDecodificaFasceEta(rec.codFasciaEta)
          }
        } else {
          return {
            ' ': this.getNumeroProgressivo(rec.codFasciaEta),
            'Protocollo': rec.protocollo,
            'Priorità assoluta': this.getPriorita(rec.idDomandaIscrizione),
            'Punteggio': rec.punteggioPrimaScelta,
            'Punteggio 2': rec.punteggio,
            'Data_nascita/ora_nascita': this.datepipe.transform(rec.dataNascita, 'dd/MM/yyyy') + ' ' + rec.oraNascita,
            'Fascia di età': this.decodificaService.getDecodificaFasceEta(rec.codFasciaEta)
            //'Data consegna': this.datepipe.transform(rec.dataConsegna, 'dd/MM/yyyy'),
            //'Fuori termine': this.decodificaService.getSiNoFromFlag(rec.flFuoriTermine),
          }
        }
      });

      this.excelService.exportReportAsExcelFile(
        json,
        `graduatoria_approvazione_${graduatoria}_${step}_${statoGraduatoria}`);
    }
  }

  private exportXlsDomandeScuolaResidenza(value: DomandeScuolaResidenza[]): void {
    const now: string = this.datepipe.transform(new Date(), 'dd/MM/yyyy');

    if (value) {
      const json = value.map(rec => {

        return {
          'Protocollo dom.': rec.protocollo,
          'CF minore': rec.codiceFiscaleMinore,
          'Cognome minore': rec.cognomeMinore,
          'Nome minore': rec.nomeMinore,
          'cod. scuola': rec.codiceScuola,
          'desc. Scuola': rec.descScuola,
          'ind. Scuola': rec.indirizzoScuola
        }
      });

      this.excelService.exportReportAsExcelFile(
        json,
        `Report_vicinanza_scuola_residenza`);
    }
  }

  getPriorita(idDomanda: number): string {
    if (idDomanda != null) {
      return 'X'
    } else {
      return " ";
    }

  }

  getNumeroProgressivo(codFasciaEta: string): number {
    if (this.cambioFascia != codFasciaEta) {
      this.numeroProgressivo = 1;
      this.cambioFascia = codFasciaEta;
    } else {
      this.numeroProgressivo++;
    }
    return this.numeroProgressivo;
  }

  get isMaterna(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'MAT';
  }

}


