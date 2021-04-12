import { TestataDomanda } from 'src/app/model/common/testata-domanda';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomandaService } from '../../service/domanda.service';
import { SrvError } from '../../model/common/srv-error';

import {
  DomandaNido,
  Richiedente,
  Minore,
  CondizioneOccupazionale,
  Anagrafica,
  LuogoNascita,
  Dipendente,
  Autonomo,
  Disoccupato,
  Studente,
  Soggetto1,
  Residenza,
  Gravidanza,
  ProblemiSalute,
  GenitoreSolo,
  Soggetto2,
  FratelloFrequentante,
  Trasferimento,
  Spostamento,
  Isee,
  ElencoNidi,
  Soggetto3,
  Soggetti,
  DatiIsee,
  CondizioniPunteggio,
  NidoContiguo
} from '../../model/common/domanda-nido';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DecodificaService } from '../../service/decodifica.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-dettaglio-domanda',
  templateUrl: './dettaglio-domanda.component.html',
  styleUrls: ['./dettaglio-domanda.component.css']
})
export class DettaglioDomandaComponent implements OnInit {
  globalError: boolean = false;

  // il dettaglio
  domandaNido$: Observable<DomandaNido | SrvError>;
  domandaNido: DomandaNido;
  statusSearchDomanda = false;
  @Input() istruttoria = false;
  @Input() modificaPreferenze: boolean = true;

  constructor(
    private domandaService: DomandaService,
    private decodificaService: DecodificaService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.statusSearchDomanda = true;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaNido$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.domandaService.getDomandaById(ordineScuola, parseInt(params.get('id')))
      )
    );
    // richiamo il dettaglio della domanda sul service della domanda
    this.domandaNido$.subscribe({
      next: (data: DomandaNido) => {
        this.domandaNido = data;
        console.log('domandaNido: ' + JSON.stringify(this.domandaNido));
        this.statusSearchDomanda = false;

        console.log("VALORE irc: " + this.domandaNido.flIrc)
      },
      error: (data: SrvError) => {
        console.log('Errore: ' + JSON.stringify(data));
        this.statusSearchDomanda = false;

        this.globalError = true;
        setTimeout(() => {
          this.globalError = false;
        }, 9000);
      },
    });
  }

  onStatusSearchDomanda(value: boolean) {
    this.statusSearchDomanda = value;
  }

  get isNido(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'NID';
  }

  get isMaterna(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'MAT';
  }

  /**
   * Getter specifici degli attributi per compattare il lor path e semplificare il binding in view sul template del componente
   */
  // Richiedente - begin
  get richiedente(): Richiedente {
    return this.domandaNido.richiedente;
  }

  // scelgo di decodificare staticamente i codici di relazione (nell'output del servizio NON sono presenti le decodifiche)
  get relazioneConMinoreText(): string {
    return this.decodificaService.getRelazioneConMinore(this.domandaNido.richiedente.relazioneConMinore);
  }

  // traduzione del flag boolean nella stringa sì/no
  get residenzaConMinoreText(): string {
    return this.decodificaService.getSiNo(this.domandaNido.minore.residenzaConRichiedente);
  }

  get presenzaNucleoMinoreText(): string {
    return this.decodificaService.getSiNo(this.domandaNido.minore.presenzaNucleo);
  }

  // decodifica statica di tutte le condizioni di coabitazione previste
  get condizioneCoabitazioneText(): string {
    return this.decodificaService.getCondizioneCoabitazione(this.domandaNido.richiedente.condizioneCoabitazione);
  }

  get anagraficaRichiedente(): Anagrafica {
    return this.domandaNido.richiedente.anagrafica;
  }

  get luogoNascitaRichiedente(): LuogoNascita {
    return this.domandaNido.richiedente.luogoNascita;
  }

  get luogoResidenzaRichiedente(): Residenza {
    return this.domandaNido.richiedente.residenza;
  }

  // Richiedente - end

  // Minore - begin
  get minore(): Minore {
    return this.domandaNido.minore;
  }

  get anagraficaMinore(): Anagrafica {
    return this.domandaNido.minore.anagrafica;
  }

  get luogoNascitaMinore(): LuogoNascita {
    return this.domandaNido.minore.luogoNascita;
  }

  get luogoResidenzaMinore(): Residenza {
    return this.domandaNido.minore.residenza;
  }

  get fratelloFrequentateMinore(): FratelloFrequentante {
    return this.domandaNido.minore.fratelloFrequentante;
  }

  get fratelloNidoContiguo(): NidoContiguo {
    return this.domandaNido.minore.fratelloNidoContiguo;
  }

  get trasferimentoMinore(): Trasferimento {
    return this.domandaNido.minore.trasferimento;
  }

  get spostamentoMinore(): Spostamento {
    return this.domandaNido.minore.spostamento;
  }

  get cambioResidenzaMinoreText(): string {
    switch (this.spostamentoMinore.dati.stato) {
      case 'VAR_RES':
        if (sessionStorage.getItem('ordineScuola') == 'NID')
          return 'il nucleo familiare del minore ha fatto richiesta di variazione di residenza.';
        else if (sessionStorage.getItem('ordineScuola') == 'MAT')
          return 'Fatta richiesta di variazione online residenza o cambiamento abitazione';
        else
          return 'Errore ordine scuola'
      case 'APP_VAR_RES':
        if (sessionStorage.getItem('ordineScuola') == 'NID')
          return 'il nucleo familiare del minore ha appuntamento in anagrafe per variazione di residenza.';
        else if (sessionStorage.getItem('ordineScuola') == 'MAT')
          return 'Preso appuntamento all\'anagrafe della Città di Torino per variazione residenza o cambiamento di abitazione';
        else
          return 'Errore ordine scuola'
      default:
        if (sessionStorage.getItem('ordineScuola') == 'NID')
          return 'il nucleo familiare del minore si trasferirà a Torino.';
        else if (sessionStorage.getItem('ordineScuola') == 'MAT')
          return 'Presenterà richiesta di cambiamento di abitazione nella Città o di variazione di residenza per trasferimento a Torino';
        else
          return 'Errore ordine scuola'
    }
  }


  // Minore - end

  // per alcune condizioni richiedente=soggetto1 => quali?
  get isSoggetto1Richiedente(): boolean {
    if (this.richiedente.anagrafica.codiceFiscale === this.soggetto1.anagrafica.codiceFiscale) {
      console.log('Il soggetto1 coincide con il richiedente');
      return true;
    }
    console.log('Il soggetto1 diverso dal richiedente');
    return false;
  }

  // soggetto1 - begin
  get soggetto1(): Soggetto1 {
    return this.domandaNido.soggetto1;
  }

  get anagraficaSoggetto1(): Anagrafica {
    return this.domandaNido.soggetto1.anagrafica;
  }

  get luogoNascitaSoggetto1(): LuogoNascita {
    return this.domandaNido.soggetto1.luogoNascita;
  }

  get luogoResidenzaSoggetto1(): LuogoNascita {
    return this.domandaNido.soggetto1.residenza;
  }

  get gravidanzaSoggetto1(): Gravidanza {
    return this.domandaNido.soggetto1.gravidanza;
  }

  get problemiSaluteSoggetto1(): ProblemiSalute {
    return this.domandaNido.soggetto1.problemiSalute;
  }

  get condizioneOccupazionaleSoggetto1(): CondizioneOccupazionale {
    return this.domandaNido.soggetto1.condizioneOccupazionale;
  }

  get genitoreSoloSoggetto1(): GenitoreSolo {
    return this.domandaNido.soggetto1.genitoreSolo;
  }

  get genitoreSoloSoggetto1Sentenza(): boolean {
    if (this.domandaNido.soggetto1.genitoreSolo.sentenza) {
      if (!this.genitoreSoloSoggetto1SentenzaNumero && !this.genitoreSoloSoggetto1SentenzaTribunale &&
        !this.genitoreSoloSoggetto1SentenzaTribunale) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  get genitoreSoloSoggetto1SentenzaNumero(): boolean {
    if (!this.domandaNido.soggetto1.genitoreSolo.sentenza.numero || this.domandaNido.soggetto1.genitoreSolo.sentenza.numero === '') {
      return false;
    } else {
      return true;
    }
  }

  get genitoreSoloSoggetto1SentenzaTribunale(): boolean {
    if (!this.domandaNido.soggetto1.genitoreSolo.sentenza.tribunale || this.domandaNido.soggetto1.genitoreSolo.sentenza.tribunale === '') {
      return false;
    } else {
      return true;
    }
  }

  get genitoreSoloSoggetto1SentenzaData(): boolean {
    if (!this.domandaNido.soggetto1.genitoreSolo.sentenza.data || this.domandaNido.soggetto1.genitoreSolo.sentenza.data === '') {
      return false;
    } else {
      return true;
    }
  }

  // soggetto1 - end


  // soggetto2 - begin
  get soggetto2(): Soggetto2 {
    return this.domandaNido.soggetto2;
  }

  get anagraficaSoggetto2(): Anagrafica {
    return this.domandaNido.soggetto2.anagrafica;
  }

  get luogoNascitaSoggetto2(): LuogoNascita {
    return this.domandaNido.soggetto2.luogoNascita;
  }

  get luogoResidenzaSoggetto2(): LuogoNascita {
    return this.domandaNido.soggetto2.residenza;
  }

  get gravidanzaSoggetto2(): Gravidanza {
    return this.domandaNido.soggetto2.gravidanza;
  }

  get problemiSaluteSoggetto2(): ProblemiSalute {
    return this.domandaNido.soggetto2.problemiSalute;
  }

  get condizioneOccupazionaleSoggetto2(): CondizioneOccupazionale {
    return this.domandaNido.soggetto2.condizioneOccupazionale;
  }

  get tipoOccupazioneSoggetto2(): string {
    return this.domandaNido.soggetto2.condizioneOccupazionale.stato;
  }

  get soggetto2Dipendente(): Dipendente {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.dipendente;
  }

  get soggetto2Autonomo(): Autonomo {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.autonomo;
  }

  get soggetto2Disoccupato(): Disoccupato {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.disoccupato;
  }

  get soggetto2Studente(): Studente {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.studente;
  }

  get presenzaNucleoSoggetto2(): String {
    return this.decodificaService.getSiNo(this.domandaNido.soggetto2.presenzaNucleo);
  }

  // soggetto2 - end

  // soggetto3 - begin

  get soggetto3(): Soggetto3 {
    if (this.domandaNido.soggetto3 != null && this.domandaNido.soggetto3.stato === true) {
      return this.domandaNido.soggetto3;
    }
    return null;
  }

  get anagraficaSoggetto3(): Anagrafica {
    return this.domandaNido.soggetto3.dati.anagrafica;
  }

  get luogoNascitaSoggetto3(): LuogoNascita {
    return this.domandaNido.soggetto3.dati.luogoNascita;
  }

  get luogoResidenzaSoggetto3(): LuogoNascita {
    return this.domandaNido.soggetto3.dati.residenza;
  }

  // soggetto3 - end

  // componenti nucleo
  get componentiNucleo(): Soggetti[] | null {
    if (this.domandaNido.componentiNucleo.soggetti != null && this.domandaNido.componentiNucleo.soggetti.length !== 0) {
      return this.domandaNido.componentiNucleo.soggetti;
    } else {
      return null;
    }
  }

  getRapportoParentelaConMinore(soggetto: Soggetti): string {
    return this.decodificaService.getRapportoParentelaConMinore(soggetto.relazioneConMinore);
  }

  // altri componenti
  get altriComponenti(): Soggetti[] | null {
    if (this.domandaNido.altriComponenti.soggetti != null && this.domandaNido.altriComponenti.soggetti.length !== 0) {
      return this.domandaNido.altriComponenti.soggetti;
    }
    return null;
  }

  // altri minori in affido
  get minoriAffido(): Soggetti[] | null {
    if (this.domandaNido.affido.soggetti != null && this.domandaNido.affido.soggetti.length !== 0) {
      return this.domandaNido.affido.soggetti;
    } else {
      return null;
    }
  }

  // affido

  // insegnamento religione cattolica
  get flIrc(): string {
    return this.domandaNido.flIrc;
  }

  get flIrcText(): string {
    if (this.domandaNido.flIrc === "S")
      return 'Si';
    else if (this.domandaNido.flIrc === "N")
      return 'No';
    else
      return 'Valore non impostato';
  }


  // isee
  get isee(): Isee {
    return this.domandaNido.isee;
  }

  get datiIsee(): DatiIsee {
    return this.domandaNido.isee.dati;
  }

  get iseeStatoText(): string {
    if (this.isee.stato) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  condizioneValidita(condizione: CondizioniPunteggio): string {
    if (condizione.validata === true) {
      return 'Si';
    } else if (condizione.validata === false) {
      return 'No';
    }
    // } else if (condizione.validata === null) {
    //   return 'Da validare';
    // }
  }

  // elenco nidi
  get elencoNidi(): ElencoNidi[] | null {
    if (this.domandaNido.elencoNidi != null
      && this.domandaNido.elencoNidi.length !== 0) {
      return this.domandaNido.elencoNidi;
    }
    return null;
  }

  get condizioniPunteggio(): CondizioniPunteggio[] | null {
    if (this.domandaNido.condizioniPunteggio != null
      && this.domandaNido.condizioniPunteggio.length !== 0) {
      return this.domandaNido.condizioniPunteggio;
    }
    return null;
  }

  get cinqueAnniNonFrequentante(): string | null {
    return this.domandaNido.minore.cinqueAnniNonFrequentante;
  }

  getTipologiaIstruttoria(condizione: CondizioniPunteggio): string {
    return this.decodificaService.getTipologiaIstruttoria(condizione.tipoIstruttoria);
  }

  getDesGenitoreSolo(stato: string): string {
    return this.decodificaService.getDesGenitoreSolo(stato);
  }

  // callback method su bottone "indietro" per accedere alla pagina di ricerca domande
  public returnTestataDomanda() {
    this.router.navigate(['/domande/ricerca/caching']);
  }

  public returnTestataIstruttoria() {
    this.router.navigate(['/istruttoria/verifiche/caching']);
  }

}
