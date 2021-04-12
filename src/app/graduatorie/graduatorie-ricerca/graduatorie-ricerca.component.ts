import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { GraduatorieFilter } from 'src/app/model/common/graduatorie-filter';
import { InfoScuola } from 'src/app/model/common/info-scuola';
import { Page } from 'src/app/model/common/Page';
import { SrvError } from 'src/app/model/common/srv-error';
import { Preferenza, TestataGraduatoria } from 'src/app/model/testata-graduatoria';
import { InfoStepGraduatoria } from 'src/app/model/visualizza-graduatoria';
import { AuthService } from 'src/app/service/auth.service';
import { DecodificaService } from 'src/app/service/decodifica.service';
import { DomandaService } from 'src/app/service/domanda.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';

@Component({
  selector: 'app-graduatorie-ricerca',
  templateUrl: './graduatorie-ricerca.component.html',
  styleUrls: ['./graduatorie-ricerca.component.css']
})
export class GraduatorieRicercaComponent implements OnInit {
  isDse: boolean = false;
  globalError: boolean = false;
  statusSearch: boolean = false;
  errorOnLoadData: boolean = false;
  guiErrorMessage: string = '';
  showResult: boolean = false;

  datiStepGraduatorie: InfoStepGraduatoria[] = [];
  elencoGraduatorie: CodiceDescrizione[] = [];
  elencoStepGraduatoria: CodiceDescrizione[] = [];
  elencoScuoleAbilitate: CodiceDescrizione[] = [];
  elencoFasceEta: CodiceDescrizione[] = [];
  elencoTipologieFrequenza: CodiceDescrizione[] = [];
  graduatoriaSelezionata: CodiceDescrizione = new CodiceDescrizione();
  stepSelezionato: CodiceDescrizione = new CodiceDescrizione();
  scuolaSelezionata: number = 0;
  fasciaSelezionata: number = 0;
  frequenzaSelezionata: number = 0;

  visualizzaGraduatoriaForm: FormGroup = new FormGroup({});

  disabledButtonRicerca: boolean = false;
  page: Page = new Page();
  flagGraduatoriaDaCalcolare: boolean = false;
  testataGraduatorie: TestataGraduatoria[];

  constructor(
    private router: Router,
    private domandeService: DomandaService,
    private graduatoriaService: GraduatoriaService,
    private decodificaService: DecodificaService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.initProperties();
    this.createForm();
    this.initInfoStepGraduatorie();
    this.initElencoScuole();
    this.initElencoFasceEta();
    this.initElencoTipologieFrquenza();
  }

  onSelectGraduatoria(): void {
    this.initElencoStep(this.graduatoriaSelezionata.codice);
    this.setUltimoStep();
  }

  onSubmit(): void {
    this.hideErrors();

    if (this.graduatoria == null) {
      this.showErrors('Attenzione: selezionare una graduatoria', false);
      return;
    }

    if (this.step == null) {
      this.showErrors('Attenzione: selezionare uno step', false);
      return;
    }

    if (this.scuola == "0") {
      this.showErrors('Attenzione: selezionare una scuola', false);
      return;
    }

    if (this.fasciaEta == "0") {
      this.showErrors('Attenzione: selezionare una fascia di età', false);
      return;
    }

    if (this.frequenza == "0") {
      this.showErrors('Attenzione: selezionare una tipologia di frequenza', false);
      return;
    }

    this.statusSearch = true;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.graduatoriaService.ricercaGraduatorie(this.isDse, this.initSearchFilter(), ordineScuola).subscribe({
      next: (response: Array<TestataGraduatoria>) => {
        let _graduatoria = new Array();
        response.forEach((element, index) => {
          let _testataGrad = new TestataGraduatoria();
          _testataGrad.posizione = (index + 1).toString();
          _testataGrad.punteggio = element.punteggio;
          _testataGrad.isee = element.isee;
          _testataGrad.cognomeMinore = element.cognomeMinore;
          _testataGrad.nomeMinore = element.nomeMinore;
          _testataGrad.dataNascitaMinore = this.datePipe.transform(element.dataNascitaMinore, 'dd/MM/yyyy');
          _testataGrad.statoPreferenza = element.statoPreferenza;
          _testataGrad.sceltaPreferenza = element.sceltaPreferenza;
          _testataGrad.descSceltaPreferenza = element.sceltaPreferenza;
          _testataGrad.preferenze = [];
          element.preferenze.forEach((element, index) => {
            let pref: Preferenza = new Preferenza();
            pref.codScuola = element.codScuola;
            pref.descrizione = element.descrizione;
            pref.indirizzo = element.indirizzo;
            pref.codTipoFrequenza = element.codTipoFrequenza;
            pref.codCategoriaScuola = element.codCategoriaScuola;
            pref.codStatoScuola = element.codStatoScuola;
            pref.punteggio = element.punteggio;
            pref.posizione = element.posizione;
            _testataGrad.preferenze.push(pref);
          });
          _graduatoria.push(_testataGrad);
        })
        this.testataGraduatorie = _graduatoria;
        this.showResult = true;
        this.page.size = 10;
        this.page.totalElements = this.testataGraduatorie.length;
        this.page.totalPages = 1;

        this.disabledButtonRicerca = true;
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: errore nella ricerca delle graduatorie');
      },
    });
  }

  onSorted(event: Event): void {

  }

  onClose(): void {
    this.router.navigate(['/graduatorie/GRA']);
  }

  onReset(): void {
    this.showResult = false;
    this.disabledButtonRicerca = false;
    this.page.size = 0;
    this.page.totalElements = 0;
    this.errorOnLoadData = false;
  }

  getDescrizionePreferenza(row: TestataGraduatoria, posizione: number): string {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');

    let pref: Preferenza = this.getPreferenzaByPosizione(row, posizione);
    if (pref == null) {
      return '';
    }

    let descTipoFrequenza: string = '';
    if (pref.codTipoFrequenza) {
      descTipoFrequenza = this.decodificaService.getDecodificaTipologiaFrequenzaSmall(pref.codTipoFrequenza, ordineScuola);
    }

    let descStatoPreferenza: string = '';
    if (pref.codStatoScuola) {
      descStatoPreferenza = this.decodificaService.getDecodificaStatoPreferenzaSmall(pref.codStatoScuola);
    }

    return `${pref.posizione}) ${pref.indirizzo} - ${descTipoFrequenza} - ${descStatoPreferenza}`;
  }

  getDescrizionePreferenzaTestata(row: TestataGraduatoria): string {
    if (row == null) {
      return '';
    }

    let descStatoPreferenza: string = '';
    if (row.statoPreferenza) {
      descStatoPreferenza = this.decodificaService.getDecodificaStatoPreferenzaSmall(row.statoPreferenza);
    }

    return `${row.descSceltaPreferenza}) - ${descStatoPreferenza}`;
  }

  visualizzaPreferenza(row: TestataGraduatoria, posizione: number): boolean {
    if (row && row.sceltaPreferenza) {
      return parseInt(row.sceltaPreferenza) !== posizione;
    }
    return false;
  }

  visualizzaPreferenzaBold(row: TestataGraduatoria, posizione: number): boolean {
    let pref: Preferenza = this.getPreferenzaByPosizione(row, posizione);
    if (pref == null) {
      return false;
    }

    return pref.codStatoScuola === 'AMM';
  }

  visualizzaPreferenzaTestataBold(row: TestataGraduatoria): boolean {
    if (row && row.statoPreferenza) {
      return row.statoPreferenza === 'AMM';
    }
    return false;
  }

  //////////////////////////////////////////////////////////////////////
  // Getters
  //////////////////////////////////////////////////////////////////////
  get criterioCompilato(): string {
    let criterioCompilato = 'Criterio compilato: ';
    this.elencoGraduatorie.forEach(element => {
      if (element.codice === this.graduatoria) {
        criterioCompilato += 'graduatoria = ' + element.descrizione;
      }
    });

    this.elencoStepGraduatoria.forEach(element => {
      if (element.codice === this.step) {
        criterioCompilato += ', step = ' + element.descrizione;
      }
    });

    this.elencoScuoleAbilitate.forEach(element => {
      if (element.codice === this.visualizzaGraduatoriaForm.get('scuola').value) {
        criterioCompilato += ', scuola = ' + element.descrizione;
      }
    });

    this.elencoFasceEta.forEach(element => {
      if (element.codice === this.visualizzaGraduatoriaForm.get('fasciaEta').value) {
        criterioCompilato += ', fasce di età = ' + element.descrizione;
      }
    });

    // flag_tutte: boolean = true;    NON più richiesto (change del 22/05/2019)
    this.elencoTipologieFrequenza.forEach(element => {
      if (element.codice === this.visualizzaGraduatoriaForm.get('frequenza').value) {
        criterioCompilato += ', tipologia frequenza = ' + element.descrizione;
      }
    });

    return criterioCompilato;
  }

  get ordineScuola(): string {
    return sessionStorage.getItem('ordineScuola');
  }

  get graduatorieDisponibili(): boolean {
    return this.elencoGraduatorie && this.elencoGraduatorie.length > 0;
  }

  get decodificaStatoUltimaGraduatoria(): string {
    const codAnagraficaGra: string = this.graduatoriaSelezionata.codice;
    const step: string = this.stepSelezionato.codice;
    if (codAnagraficaGra != null && step != null) {
      const filtered: InfoStepGraduatoria[] = this.datiStepGraduatorie.filter(
        item => item.codAnagraficaGra == codAnagraficaGra && item.step.toString() == step
      );
      if (filtered.length > 0) {
        return this.decodificaService.getDecodificaStatoGraduatoria(filtered[0].codStatoGra);
      }
    }

    return '';
  }

  get graduatoria(): string {
    let cdGraduatoria: CodiceDescrizione = this.visualizzaGraduatoriaForm.get('graduatoria').value;
    return cdGraduatoria ? cdGraduatoria.codice : null;
  }

  get step(): string {
    let cdStep: CodiceDescrizione = this.visualizzaGraduatoriaForm.get('step').value;
    return cdStep ? cdStep.codice : null;
  }

  get scuola(): string {
    return this.visualizzaGraduatoriaForm.get('scuola').value;
  }

  get fasciaEta(): string {
    return this.visualizzaGraduatoriaForm.get('fasciaEta').value;
  }

  get frequenza(): string {
    return this.visualizzaGraduatoriaForm.get('frequenza').value;
  }

  //////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////
  private initProperties(): void {
    // verifica se la url contiene il parametro 'dse'
    if (this.route.snapshot.paramMap.get('tipoRicerca') === 'dse') {
      this.isDse = true;
    }
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
        }
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors('Attenzione: errore nel recupero dati dell\'ultima graduatoria');
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

  private initElencoScuole(): void {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandeService.getScuoleByUtente(ordineScuola).subscribe({
      next: (response: Array<InfoScuola>) => {
        this.elencoScuoleAbilitate = [];
        response.forEach((element, index) => {
          this.elencoScuoleAbilitate.push({
            codice: response[index].codScuola,
            descrizione: response[index].indirizzo + ' - ' + response[index].descrizione
          });
        });
      },
      error: (response: SrvError) => {
        this.showErrors('Attenzione: errore nel caricamento elenco scuole abilitate');
      }
    });
  }

  private initElencoFasceEta(): void {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.elencoFasceEta = this.decodificaService.getElencoFasceEta(ordineScuola);
  }

  private initElencoTipologieFrquenza(): void {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.elencoTipologieFrequenza = this.decodificaService.getElencoTipologieFrquenza(ordineScuola);
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

  private createForm(): void {
    this.visualizzaGraduatoriaForm.addControl('graduatoria', new FormControl('', [Validators.required]));
    this.visualizzaGraduatoriaForm.addControl('step', new FormControl('', [Validators.required]));
    this.visualizzaGraduatoriaForm.addControl('scuola', new FormControl('', [Validators.required]));
    this.visualizzaGraduatoriaForm.addControl('fasciaEta', new FormControl('', [Validators.required]));
    this.visualizzaGraduatoriaForm.addControl('frequenza', new FormControl('', [Validators.required]));
  }

  private initSearchFilter(): GraduatorieFilter {
    const filter: GraduatorieFilter = new GraduatorieFilter();
    filter.codiceGraduatoria = this.graduatoria;
    filter.codiceStepGraduatoria = this.step;
    filter.codiceScuola = this.scuola;
    filter.codiceFasciaEta = this.fasciaEta;
    filter.codiceTipologiaFrequenza = this.frequenza;

    return filter;
  }

  private getPreferenzaByPosizione(row: TestataGraduatoria, posizione: number): Preferenza {
    if (row == null || posizione == null || row.preferenze == null) {
      return null;
    }

    for (let pref of row.preferenze) {
      if (pref.posizione === posizione) {
        return pref;
      }
    }

    return null;
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

    if (!this.isDse) {
      result = result.filter(item => {
        return item.codStatoGra == 'PUB' || item.codStatoGra == 'PRO_CON';
      });
    }

    return result;
  }

  private showErrors(message: string, hide: boolean = true): void {
    this.guiErrorMessage = message;
    this.errorOnLoadData = true;
    if (hide) {
      setTimeout(() => {
        this.errorOnLoadData = false;
      }, 9000);
    }
  }

  private hideErrors(): void {
    this.errorOnLoadData = false;
  }

}
