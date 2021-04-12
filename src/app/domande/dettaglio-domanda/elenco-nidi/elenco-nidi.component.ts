import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { InfoScuola } from 'src/app/model/common/info-scuola';
import { SrvError } from 'src/app/model/common/srv-error';
import { DomandaService } from 'src/app/service/domanda.service';
import { ProfileService } from 'src/app/service/profile.service';
import { DomandaNido, ElencoNidi } from '../../../model/common/domanda-nido';
import { DecodificaService } from '../../../service/decodifica.service';

@Component({
  selector: 'app-elenco-nidi',
  templateUrl: './elenco-nidi.component.html',
  styleUrls: ['./elenco-nidi.component.css']
})
export class ElencoNidiComponent implements OnInit {
  @Input() elencoNidi: ElencoNidi[];
  @Input() modificaPreferenze: boolean = false;
  @Input() dataNascitaMinore: string = null;
  @Input() idDomanda: number = null;
  @Input() statoDomanda: string = null;
  @Input() codAnno: string = null;
  @Output() onStatusSearchDomanda = new EventEmitter<boolean>();

  private readonly MAX_NIDI: number = 10;
  private readonly MAX_MATERNE: number = 10;

  error: boolean = false;
  errorMessage: string = '';

  modificaPreferenzeForm: FormGroup = new FormGroup({});
  tipoFrequenzaList: CodiceDescrizione[] = [];
  nidoList: CodiceDescrizione[] = [];
  elencoNidiCompleto: InfoScuola[] = [];

  constructor(
    private decodificaService: DecodificaService,
    private domandaService: DomandaService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.buildFormModificaPreferenze();
    if (this.modificaPreferenze) {
      this.initElencoScuole();
    }
  }

  //////////////////////////////////////////////////////////////////////
  // gestione form
  //////////////////////////////////////////////////////////////////////
  onSelectTipoFrequenza(): void {
    this.resetScuolaSelezionata();

    const codTipoFrequenza: string = this.modificaPreferenzeForm.controls['tipo-frequenza'].value;
    this.initScuolaList(codTipoFrequenza);
  }

  aggiungiPreferenza(): void {
    const codScuola: string = this.modificaPreferenzeForm.controls['nido'].value;
    const codTipoFrequenza: string = this.modificaPreferenzeForm.controls['tipo-frequenza'].value;

    if (this.idDomanda == null) {
      this.showError("Domanda non valida");
      return;
    }

    if (codScuola == null || codTipoFrequenza == null) {
      this.showError("Selezionare una scuola ed un tempo di frequenza");
      return;
    }

    this.onStatusSearchDomanda.emit(true);
    this.domandaService.insertScuolaFuoriTermine(this.ordineScuola, this.idDomanda, codScuola, codTipoFrequenza).subscribe({
      next: (response: void) => {
        this.reloadElencoScuole();
      },
      error: (response: SrvError) => {
        this.onStatusSearchDomanda.emit(false);
        this.showError("Errore durante l'inserimento della nuova preferenza");
      },
    });
  }

  get showModificaPreferenze(): boolean {
    if (this.modificaPreferenze) {
      if (this.statoDomanda != 'GRA') {
        return false;
      }

      return this.profileService.hasPrivilegioInserisciPreferenza();
    }
    return false;
  }

  get aggiungiPreferenzaAbilitato(): boolean {
    if (this.isNido && this.elencoNidi.length >= this.MAX_NIDI) {
      return false;
    }

    if (this.isMaterna && this.elencoNidi.length >= this.MAX_MATERNE) {
      return false;
    }

    return this.modificaPreferenzeForm.valid;
  }

  get ordineScuola(): string {
    return sessionStorage.getItem('ordineScuola');
  }

  get isNido(): boolean {
    return this.ordineScuola == 'NID';
  }

  get isMaterna(): boolean {
    return this.ordineScuola == 'MAT';
  }

  //////////////////////////////////////////////////////////////////////
  // gestione elenco nidi
  //////////////////////////////////////////////////////////////////////
  getTipologiaFrequenzaScuola(nido: ElencoNidi): string {
    return this.decodificaService.getTipologiaFrequenzaScuola(nido.codTipoFrequenza, this.ordineScuola);
  }

  getDescStatoPreferenza(nido: ElencoNidi): string {
    return this.decodificaService.getDecodificaStatoPreferenza(nido.codStatoScuola);
  }

  getFuoriTermineText(valueFuoriTermine): string {
    if (valueFuoriTermine) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  //////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////
  private initElencoScuole(): void {
    let dataNascita: Date = null;
    if (this.dataNascitaMinore) {
      const aData = this.dataNascitaMinore.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (!aData) {
        this.showError("Data minore non valida");
        return;
      }
      dataNascita = new Date(
        parseInt(aData[3], 10),
        parseInt(aData[2], 10) - 1,
        parseInt(aData[1], 10)
      );
    }

    if (this.isNido) {
      this.domandaService.getScuoleNido(dataNascita).subscribe({
        next: (response: InfoScuola[]) => {
          if (response) {
            this.elencoNidiCompleto = response;
            this.initFrequenzaList();
            this.initScuolaList(null);
          }
        },
        error: (response: SrvError) => {
          this.showError("Errore durante il caricamento delle scuole selezionabili");
        },
      });
    }

    if (this.isMaterna) {
      this.domandaService.getScuoleMaterna(dataNascita, this.codAnno).subscribe({
        next: (response: InfoScuola[]) => {
          if (response) {
            this.elencoNidiCompleto = response;
            this.initFrequenzaList();
            this.initScuolaList(null);
          }
        },
        error: (response: SrvError) => {
          this.showError("Errore durante il caricamento delle scuole selezionabili");
        },
      });
    }
  }

  private reloadElencoScuole(): void {
    this.onStatusSearchDomanda.emit(true);
    this.domandaService.getDomandaById(this.ordineScuola, this.idDomanda).subscribe({
      next: (response: DomandaNido) => {
        this.elencoNidi = [];
        if (response) {
          this.elencoNidi = response.elencoNidi;
          this.resetPreferenzaSelezionata();
          this.resetScuolaSelezionata();
          this.initFrequenzaList();
          this.initScuolaList(null);
        }
        this.onStatusSearchDomanda.emit(false);
      },
      error: (response: SrvError) => {
        this.onStatusSearchDomanda.emit(false);
        this.showError("Errore durante la lettura delle preferenze aggiornate");
      },
    });
  }

  private buildFormModificaPreferenze(): void {
    this.modificaPreferenzeForm = new FormGroup({});
    this.modificaPreferenzeForm.addControl('tipo-frequenza', new FormControl(null, [Validators.required]));
    this.modificaPreferenzeForm.addControl('nido', new FormControl(null, [Validators.required]));
  }

  private initFrequenzaList(): void {
    this.tipoFrequenzaList = this.decodificaService.getElencoTipologieFrquenza(this.ordineScuola);
  }

  private initScuolaList(codTipoFrequenza: string): void {
    let items: CodiceDescrizione[] = [];
    if (this.elencoNidiCompleto && codTipoFrequenza) {
      if (this.isNido) {
        for (let item of this.elencoNidiCompleto) {
          if (
            (codTipoFrequenza == 'BRV' && item.tempoBreve) ||
            (codTipoFrequenza == 'LNG' && item.tempoLungo) ||
            (codTipoFrequenza == 'INT' && item.tempoIntermedio)
          ) {
            if (!this.scuolaPresente(item.codScuola, codTipoFrequenza)) {
              items.push({
                codice: item.codScuola,
                descrizione: `${item.indirizzo} - ${item.descrizione}`
              });
            }
          }
        }
      }

      if (this.isMaterna) {
        for (let item of this.elencoNidiCompleto) {
          if (!this.scuolaPresente(item.codScuola, codTipoFrequenza)) {
            items.push({
              codice: item.codScuola,
              descrizione: `${item.indirizzo} - ${item.descrizione}`
            });
          }
        }
      }

      items.sort((a, b) => {
        const descA = a.descrizione.toLowerCase();
        const descB = b.descrizione.toLowerCase();

        return descA.localeCompare(descB);
      });
    }

    this.nidoList = items;
  }

  private resetScuolaSelezionata(): void {
    this.modificaPreferenzeForm.controls['nido'].setValue(null);
  }

  private resetPreferenzaSelezionata(): void {
    this.modificaPreferenzeForm.controls['tipo-frequenza'].setValue(null);
  }

  private scuolaPresente(codScuola: string, codTipoFrequenza: string): boolean {
    if (this.elencoNidi) {
      for (let nido of this.elencoNidi) {
        if (nido.codScuola == codScuola && nido.codTipoFrequenza == codTipoFrequenza) {
          return true;
        }
      }
    }
    return false;
  }

  private showError(message: string): void {
    this.errorMessage = message;
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 9000);
  }

}
