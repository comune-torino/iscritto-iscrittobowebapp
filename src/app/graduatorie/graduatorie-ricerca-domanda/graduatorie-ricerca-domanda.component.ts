import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { DomandeFilter } from 'src/app/model/common/domande-filter';
import { InfoScuola } from 'src/app/model/common/info-scuola';
import { Page } from 'src/app/model/common/Page';
import { SrvError } from 'src/app/model/common/srv-error';
import { TestataDomanda } from 'src/app/model/common/testata-domanda';
import { AuthService } from 'src/app/service/auth.service';
import { DomandaService } from 'src/app/service/domanda.service';

@Component({
  selector: 'app-graduatorie-ricerca-domanda',
  templateUrl: './graduatorie-ricerca-domanda.component.html',
  styleUrls: ['./graduatorie-ricerca-domanda.component.css']
})
export class GraduatorieRicercaDomandaComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSelect = new EventEmitter<number>();

  statusSearch: boolean = false;
  errors: boolean = false;
  errorMessage: string = '';

  // stati visualizzazione
  viewRicerca: boolean = false;
  viewElencoDomande: boolean = false;

  // dati ricerca
  criterioForm = new FormGroup({});
  filtroRicercaForm = new FormGroup({});
  scuole: CodiceDescrizione[] = [];
  statiDomanda: CodiceDescrizione[];
  raggruppamentoSelezionato: String = 'CF';
  testataDomande: TestataDomanda[] = [];

  // paginazione
  sortTestataDomande: TestataDomanda[];
  page = new Page();
  startItem = 0;
  endItem = 0;
  rows: any = [];

  constructor(
    private domandaService: DomandaService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.initFormCriterio();
    this.initFormRicerca(this.raggruppamentoSelezionato);
    this.initPaginazione();

    this.initElencoScuole();
    this.initStatiDomanda();

    this.showRicerca();
  }

  onChangeTipoRicerca(raggruppamento: string): void {
    this.raggruppamentoSelezionato = raggruppamento;
    this.clearFormRicerca();
    this.initFormRicerca(this.raggruppamentoSelezionato);
  }

  onSubmitRicerca(): void {
    this.ricercaDomande();
  }

  onSelectDomanda(idDomanda: number): void {
    if (idDomanda) {
      this.onSelect.emit(idDomanda);
    }
  }

  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////
  showRicerca(): void {
    this.hideAll();
    this.viewRicerca = true;
  }

  showElencoDomande(): void {
    this.hideAll();
    this.viewElencoDomande = true;
  }

  hideAll(): void {
    this.viewRicerca = false;
    this.viewElencoDomande = false;
  }

  returnSearch(): void {
    this.onClose.emit();
  }

  //////////////////////////////////////////////////////////////////////
  // Operazioni su tabella
  //////////////////////////////////////////////////////////////////////
  changePage(pageNumber: number) {
    this.page.pageNumber = pageNumber;
    this.startItem = (this.page.pageNumber - 1) * this.page.size;
    this.endItem = this.startItem + this.page.size;
    this.rows = this.sortTestataDomande.slice(this.startItem, this.endItem);
  }

  onSorted(infoSort: any): void {
    const compare = (a: number | string, b: number | string, isAsc: boolean): number => {
      const comparison = a < b ? -1 : (a > b ? 1 : 0);
      return comparison * (isAsc ? 1 : -1);
    }

    const compareDate = (a: number | string, b: number | string, isAsc: boolean): number => {
      const comparison = a < b ? -1 : (a > b ? 1 : 0);
      return ((a === null && b !== null) ? -1 : (b === null ? 1 : comparison)) * (isAsc ? 1 : -1);
    }

    this.sortTestataDomande = this.testataDomande;
    this.rows = this.sortTestataDomande.sort((a, b) => {
      const isAsc = infoSort.sortDirection === 'asc';
      switch (infoSort.sortColumn) {
        case 'protocolloDomandaIscrizione':
          return compare(a.protocolloDomandaIscrizione, b.protocolloDomandaIscrizione, isAsc);
        case 'cognomeMinore':
          return compare(a.cognomeMinore, b.cognomeMinore, isAsc);
        case 'codiceFiscaleMinore':
          return compare(a.codiceFiscaleMinore, b.codiceFiscaleMinore, isAsc);
        case 'statoDomandaDescrizione':
          return compare(a.statoDomandaDescrizione, b.statoDomandaDescrizione, isAsc);
        case 'dataUltimaModifica':
          const aData = a.dataUltimaModifica.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          const bData = b.dataUltimaModifica.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          return compareDate(new Date(parseInt(aData[3], 10), parseInt(aData[2], 10) - 1, parseInt(aData[1], 10)).getTime(),
            new Date(parseInt(bData[3], 10), parseInt(bData[2], 10) - 1, parseInt(bData[1], 10)).getTime(), isAsc);
        default:
          return 0;
      }
    }).slice(this.startItem, this.endItem);
  }

  //////////////////////////////////////////////////////////////////////
  // getters
  //////////////////////////////////////////////////////////////////////
  get disableRicerca() {
    if (this.raggruppamentoSelezionato === 'CF') {
      return !this.filtroRicercaForm.valid;
    }
    if (this.raggruppamentoSelezionato === 'CC') {
      return this.filtroRicercaForm.get('nomeMinore').invalid && this.filtroRicercaForm.get('cognomeMinore').invalid;
    }
    if (this.raggruppamentoSelezionato === 'PD') {
      return !this.filtroRicercaForm.valid;
    }
    if (this.raggruppamentoSelezionato === 'SS') {
      return !this.filtroRicercaForm.valid;
    }
  }

  get codiceFiscaleMinore() {
    return this.filtroRicercaForm.get('codiceFiscaleMinore').value;
  }

  get nomeMinore() {
    if (!this.filtroRicercaForm || !this.filtroRicercaForm.get('nomeMinore')) {
      return '';
    }
    return this.filtroRicercaForm.get('nomeMinore').value;
  }

  get cognomeMinore() {
    if (!this.filtroRicercaForm || !this.filtroRicercaForm.get('cognomeMinore')) {
      return '';
    }
    return this.filtroRicercaForm.get('cognomeMinore').value;
  }

  get codiceScuola() {
    return this.filtroRicercaForm.get('codiceScuola').value;
  }

  get protocolloDomanda() {
    if (!this.filtroRicercaForm || !this.filtroRicercaForm.get('protocolloDomanda')) {
      return '';
    }
    return this.filtroRicercaForm.get('protocolloDomanda').value;
  }

  get codiceStatoDomanda() {
    return this.filtroRicercaForm.get('codiceStatoDomanda').value;
  }

  get criterioCompilato() {
    let context = '';
    const prefix = 'Filtro di ricerca impostato: [ ';
    if (this.raggruppamentoSelezionato === 'CF') {
      context += 'codice fiscale = ' + this.codiceFiscaleMinore;
    }
    if (this.raggruppamentoSelezionato === 'CC') {
      if (this.cognomeMinore != null && this.cognomeMinore.length !== 0) {
        context += 'cognome = ' + this.cognomeMinore;
      }
      if (this.nomeMinore != null && this.nomeMinore.length !== 0) {
        if (this.cognomeMinore === null || this.cognomeMinore === '') {
          context += 'nome = ' + this.nomeMinore;
        } else {
          context += ', nome = ' + this.nomeMinore;
        }
      }
    }
    if (this.raggruppamentoSelezionato === 'PD') {
      if (this.protocolloDomanda != null && this.protocolloDomanda.length !== 0) {
        context += 'numero domanda = ' + this.protocolloDomanda;
      }
    }
    if (this.raggruppamentoSelezionato === 'SS') {
      if (this.codiceScuola === 0) {
        context += 'scuola = ' + 'TUTTE';
      } else {
        this.scuole.forEach(element => {
          if (element.codice === this.codiceScuola) {
            context += 'scuola = ' + element.descrizione;
          }
        });
      }
      // filtro opzionale
      if (this.codiceStatoDomanda != null && this.codiceStatoDomanda.length !== 0) {
        if (this.codiceStatoDomanda == 0) {
          context += ', stato domanda = ' + 'TUTTE';
        } else {
          this.statiDomanda.forEach(element => {
            if (element.codice === this.codiceStatoDomanda) {
              context += ', stato domanda = ' + element.descrizione;
            }
          });
        }
      }
    }
    return prefix + context + ' ]';
  }

  //////////////////////////////////////////////////////////////////////
  // utils
  //////////////////////////////////////////////////////////////////////
  private initFormCriterio(): void {
    this.criterioForm.addControl('criterio', new FormControl());
    this.criterioForm.get('criterio').setValue(this.raggruppamentoSelezionato);
  }

  private initFormRicerca(criterio: String): void {
    this.clearFormRicerca();
    switch (criterio) {
      case 'CF':
        this.filtroRicercaForm.addControl('codiceFiscaleMinore',
          new FormControl(null, [Validators.required, Validators.minLength(16), Validators.maxLength(16)]));
        break;
      case 'CC':
        this.filtroRicercaForm.addControl('cognomeMinore',
          new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]));
        this.filtroRicercaForm.addControl('nomeMinore',
          new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(16)]));
        break;
      case 'PD':
        this.filtroRicercaForm.addControl('protocolloDomanda',
          new FormControl(null, [Validators.required, Validators.minLength(14), Validators.maxLength(14)]));
        break;
      case 'SS':
        this.filtroRicercaForm.addControl('codiceStatoDomanda', new FormControl(null, [Validators.required]));
        this.filtroRicercaForm.addControl('codiceScuola', new FormControl(null, [Validators.required]));
        break;
    }
  }

  private initPaginazione(): void {
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.startItem = 0;
    this.endItem = this.page.size;
    this.sortTestataDomande = this.testataDomande;
    if (this.testataDomande.length > 0) {
      this.rows = this.testataDomande.slice(this.startItem, this.endItem);
    }
    this.page.totalElements = this.testataDomande.length;
    this.page.totalPages = this.page.totalElements / this.page.size;
  }

  private clearFormRicerca(): void {
    this.filtroRicercaForm.removeControl('codiceFiscaleMinore');
    this.filtroRicercaForm.removeControl('cognomeMinore');
    this.filtroRicercaForm.removeControl('nomeMinore');
    this.filtroRicercaForm.removeControl('protocolloDomanda');
    this.filtroRicercaForm.removeControl('codiceStatoDomanda');
    this.filtroRicercaForm.removeControl('codiceScuola');
  }

  private initElencoScuole(): void {
    this.scuole = [];
    this.statusSearch = true;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.getScuoleByUtente(ordineScuola).subscribe({
      next: (response: InfoScuola[]) => {
        let result: CodiceDescrizione[] = [];
        response.forEach((element) => {
          result.push({
            codice: element.codScuola,
            descrizione: element.indirizzo + ' - ' + element.descrizione
          });
        });
        this.scuole = result;
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors("Errore durante il caricamento dell'elenco scuole");
      },
    });
  }

  private initStatiDomanda(): void {
    this.statiDomanda = [];
    this.statusSearch = true;
    this.domandaService.getStatiDomanda().subscribe({
      next: (response: CodiceDescrizione[]) => {
        let result: CodiceDescrizione[] = [];
        response.forEach((element) => {
          result.push({
            codice: element.codice,
            descrizione: element.descrizione
          });
        });
        this.statiDomanda = result;
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors("Errore durante il caricamento degli stati domanda");
      }
    });
  }

  private ricercaDomande(): void {
    const filter: DomandeFilter = this.buildDomandeFilter();
    this.statusSearch = true;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.getDomande(ordineScuola, filter, null).subscribe({
      next: (response: TestataDomanda[]) => {
        this.testataDomande = response;
        this.statusSearch = false;
        this.initPaginazione();
        this.showElencoDomande();
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showErrors("Errore durante la ricerca delle domande");
      },
    });
  }

  private buildDomandeFilter(): DomandeFilter {
    const result: DomandeFilter = new DomandeFilter();
    switch (this.raggruppamentoSelezionato) {
      case 'CF':
        result.codiceFiscaleMinore = this.codiceFiscaleMinore;
        break;
      case 'CC':
        if (this.cognomeMinore && this.cognomeMinore.length !== 0) {
          result.cognomeMinore = this.cognomeMinore;
        }
        if (this.nomeMinore && this.nomeMinore.length !== 0) {
          result.nomeMinore = this.nomeMinore;
        }
        break;
      case 'PD':
        result.protocollo = this.protocolloDomanda;
        break;
      case 'SS':
        result.codiceScuola = this.codiceScuola;
        if (this.codiceStatoDomanda) {
          result.codiceStatoDomanda = this.codiceStatoDomanda;
        }
        break;
    }
    return result;
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

}
