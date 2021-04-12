import { Injectable } from '@angular/core';
import { CodiceDescrizione } from '../model/common/codice-descrizione';

Injectable({
  providedIn: 'root',
});

/**
 * Classe di servizio per le decodifiche di dati tabellari di interesse per il BackOffice
 * Incapsula gli elenchi di dati tabellari e per ognuno offre l'operazione che a fronte di un codice restituisce una decodifica descrittiva
 */
export class DecodificaService {
  private _condizioneCoabitazione: CodiceDescrizione[] = [
    { codice: 'A', descrizione: 'Il richiedente coabita con altro genitore' },
    {
      codice: 'B', descrizione: 'Il richiedente è coniugato o unito civilmente ' +
        'o ha sottoscritto convivenza di fatto con altro genitore ma non coabita con lui/lei'
    },
    {
      codice: 'C', descrizione: 'Il richiedente è coniugato o unito civilmente o ha sottoscritto convivenza di fatto con altra persona' +
        ' che non è il genitore del bambino o bambina'
    },
    { codice: 'D', descrizione: 'Il richiedente non è in nessuna di queste situazioni (genitore solo)' },
    {
      codice: 'E', descrizione: 'Il genitore che coabita con il bambino' +
        ' o la bambina è coniugato o unito civilmente o ha sottoscritto convivenza di fatto ' +
        'o convivenza su base affettiva con persona che non è l altro genitore richiedente'
    },
    {
      codice: 'F', descrizione: 'Il genitore coabitante non è coniugato ' +
        'o unito civilmente né ha sottoscritto convivenza di fatto (genitore solo)'
    },
  ];

  private _dipendente = 'DIP';

  public get DIPENDENTE(): string {
    return this._dipendente;
  }

  private _autonomo = 'AUT';

  public get AUTONOMO(): string {
    return this._autonomo;
  }

  private _disoccupato = 'DIS';

  public get DISOCCUPATO() {
    return this._disoccupato;
  }

  private _occupatoParziale = 'DIS_LAV';

  public get OCCUPATO_PARZIALE(): string {
    return this._occupatoParziale;
  }

  private _studente = 'STU';

  public get STUDENTE(): string {
    return this._studente;
  }

  private _nocondizione = 'NO_COND';

  public get NO_CONDIZIONE_OCCUPAZIONALE(): string {
    return this._nocondizione;
  }

  private _sn: CodiceDescrizione[] = [
    { codice: 'S', descrizione: 'Si' },
    { codice: 'N', descrizione: 'No' }
  ];

  private _condizioneOccupazionale: CodiceDescrizione[] = [
    { codice: 'DIP', descrizione: 'persona con contratto di lavoro dipendente o parasubordinato' },
    { codice: 'AUT', descrizione: 'persona con lavoro autonomo, coadiuvante o con  libera professione' },
    { codice: 'DIS', descrizione: 'persona disoccupata' },
    { codice: 'DIS_LAV', descrizione: 'persona disoccupata o non occupata che ha lavorato almeno 6 mesi nei precedenti 12' },
    { codice: 'STU', descrizione: 'studente' },
    { codice: 'NO_COND', descrizione: 'nessuna condizione' }
  ];


  private _condizioneGenitoreSolo: CodiceDescrizione[] = [
    { codice: 'GEN_DEC', descrizione: 'altro genitore è deceduto' },
    { codice: 'NUB_CEL_NO_RIC', descrizione: 'nubile/celibe con figlia/o non riconosciuta/o dall’altro genitore' },
    { codice: 'NUB_CEL_RIC', descrizione: 'nubile/celibe con figlia/o riconosciuta/o dall’altro genitore e non coabita con lei/lui' },
    { codice: 'DIV', descrizione: 'divorziata/o' },
    {
      codice: 'IST_SEP', descrizione: 'ha presentato istanza di separazione e' +
        ' non coabita con il genitore della bambina o del bambino di cui si chiede l’iscrizione'
    },
    {
      codice: 'SEP', descrizione: 'persona legalmente separata/o e non coabita ' +
        'con il genitore della bambina o del bambino di cui si chiede l’iscrizione'
    },
    { codice: 'NO_RES_GEN', descrizione: 'all’altro genitore è stata tolta la responsabilità genitoriale' }
  ];


  // relazione con minore
  private _relazioneConMinore: CodiceDescrizione[] = [
    { codice: 'GEN', descrizione: 'genitore' },
    { codice: 'AFF', descrizione: 'Affidatario' },
    { codice: 'TUT', descrizione: 'Tutore' }
  ];

  // rapporto di parentela con minore
  private _rapportoParentelaConMinore: CodiceDescrizione[] = [
    { codice: 'FGL', descrizione: 'Figlio/a del richiedente o altro genitore' },
    { codice: 'MIN_AFF', descrizione: 'Minore in affidamento' },
    { codice: 'ALT_COM', descrizione: 'Altro componente' },
    { codice: 'GEN', descrizione: 'Genitore' },
    { codice: 'AFF', descrizione: 'Persona affidataria' },
    { codice: 'TUT', descrizione: 'TUTORE' },
  ];

  // tipo frequenza
  private _tipologiaFrequenzaNido: CodiceDescrizione[] = [
    { codice: 'BRV', descrizione: 'Tempo breve' },
    { codice: 'LNG', descrizione: 'Tempo lungo' }
    // { codice: 'INT', descrizione: 'Intermedio' }  NON più richiesto (22/05/2019)
  ];

  private _tipologiaFrequenzaMaterna: CodiceDescrizione[] = [
    { codice: 'ND', descrizione: 'N.A.' }
  ];

  // tipo frequenza small
  private _tipologiaFrequenzaNidoSmall: CodiceDescrizione[] = [
    { codice: 'BRV', descrizione: 'TB' },
    { codice: 'LNG', descrizione: 'TL' }
  ];

  private _tipologiaFrequenzaMaternaSmall: CodiceDescrizione[] = [
    { codice: 'ND', descrizione: 'ND' }
  ];

  private _elencoFasceEta = [
    { codice: 'L', descrizione: 'Lattanti' },
    { codice: 'P', descrizione: 'Piccoli' },
    { codice: 'G', descrizione: 'Grandi' },
    { codice: 'I', descrizione: 'Primo Anno' },
    { codice: 'II', descrizione: 'Secondo Anno' },
    { codice: 'III', descrizione: 'Terzo Anno' },
    { codice: 'AGEN', descrizione: 'Anticipatari Gennaio' },
    { codice: 'AFEB', descrizione: 'Anticipatari Febbraio' },
    { codice: 'AMAR', descrizione: 'Anticipatari Marzo' },
    { codice: 'AAPR', descrizione: 'Anticipatari Aprile' },
    { codice: 'E', descrizione: 'Classe Eterogenea' }
  ];

  private _elencoFasceEtaNido = [
    { codice: 'L', descrizione: 'Lattanti' },
    { codice: 'P', descrizione: 'Piccoli' },
    { codice: 'G', descrizione: 'Grandi' }   
  ];

  private _elencoFasceEtaMaterna = [
    { codice: 'I', descrizione: 'Primo Anno' },
    { codice: 'II', descrizione: 'Secondo Anno' },
    { codice: 'III', descrizione: 'Terzo Anno' },
    { codice: 'AGEN', descrizione: 'Anticipatari Gennaio' },
    { codice: 'AFEB', descrizione: 'Anticipatari Febbraio' },
    { codice: 'AMAR', descrizione: 'Anticipatari Marzo' },
    { codice: 'AAPR', descrizione: 'Anticipatari Aprile' },
    { codice: 'E', descrizione: 'Classe Eterogenea' }
  ];
  // tipo istruttoria
  private _tipoIstruttoria: CodiceDescrizione[] = [
    { codice: 'P', descrizione: 'preventiva' },
    { codice: 'S', descrizione: 'successiva' },
    { codice: 'N', descrizione: 'nessuna istruttoria' }
  ];

  // stati graduatoria
  private _statoGraduatoria: CodiceDescrizione[] = [
    { codice: 'CAL', descrizione: 'Da calcolare' },
    { codice: 'PRO', descrizione: 'Provvisoria' },
    { codice: 'DEF', descrizione: 'Definitiva' },
    { codice: 'PRO_CON', descrizione: 'Provvisoria congelata' },
    { codice: 'DEF_CON', descrizione: 'Definitiva congelata' },
    { codice: 'PUB', descrizione: 'Pubblicata' },
  ];

  private _statiPreferenza: CodiceDescrizione[] = [
    { codice: 'ACC', descrizione: 'Accettato' },
    { codice: 'PEN', descrizione: 'In graduatoria' },
    { codice: 'RIN', descrizione: 'Rinunciato' },
    { codice: 'AMM', descrizione: 'Ammesso' },
    { codice: 'RIT', descrizione: 'Ritirato' },
    { codice: 'CAN', descrizione: 'Cancellato per accettazione' },
    { codice: 'CAN_1SC', descrizione: 'Cancellazione per attribuzione 1a scelta' },
    { codice: 'RIN_AUTO', descrizione: 'Rinuncia automatica' },
    { codice: 'CAN_R_1SC', descrizione: 'Cancellazione per rinuncia prima scelta' },
    { codice: 'CAN_RIN', descrizione: 'Cancellazione per rinuncia' },
    { codice: 'NON_AMM', descrizione: 'Non Ammesso' },
    { codice: 'ANN', descrizione: 'Annullata dal richiedente' }
  ];

  private _statiPreferenzaSmall: CodiceDescrizione[] = [
    { codice: 'ACC', descrizione: 'Accettato' },
    { codice: 'PEN', descrizione: 'In graduatoria' },
    { codice: 'RIN', descrizione: 'Rinunciato' },
    { codice: 'AMM', descrizione: 'Ammesso' },
    { codice: 'RIT', descrizione: 'Ritirato' },
    { codice: 'CAN', descrizione: 'Cancellato per accettazione' },
    { codice: 'CAN_1SC', descrizione: 'Canc. per attr. 1a scelta' },
    { codice: 'RIN_AUTO', descrizione: 'Rinuncia automatica' },
    { codice: 'CAN_R_1SC', descrizione: 'Canc. per rinuncia 1a scelta' },
    { codice: 'CAN_RIN', descrizione: 'Cancellazione per rinuncia' },
    { codice: 'NON_AMM', descrizione: 'Non Ammesso' },
    { codice: 'ANN', descrizione: 'Annullata dal richiedente' }
  ];

  private _posizionePreferenza: CodiceDescrizione[] = [
    { codice: '1', descrizione: 'prima' },
    { codice: '2', descrizione: 'seconda' },
    { codice: '3', descrizione: 'terza' },
    { codice: '4', descrizione: 'quarta' },
    { codice: '5', descrizione: 'quinta' },
    { codice: '6', descrizione: 'sesta' },
    { codice: '7', descrizione: 'settima' },
    { codice: '8', descrizione: 'ottava' },
    { codice: '9', descrizione: 'nona' },
    { codice: '10', descrizione: 'dieci' }
  ];

  getDecodificaSN(codice: string): string {
    let descrizione: string = '';
    this._sn.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getSN(): Array<CodiceDescrizione> {
    return this._sn;
  }

  getBooleanFromSN(sn?: string): boolean {
    if (sn) {
      return 'S' === sn;
    }
    return null;
  }

  getSNFromBoolean(value?: boolean): string {
    return value ? 'S' : 'N';
  }

  getSiNoFromFlag(value?: string) {
    if (!value) {
      return '';
    }
    return value == 'S' ? 'Si' : 'No';
  }

  getDecodificaStatoPreferenza(codice: string): string {
    let descrizione: string;
    this._statiPreferenza.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getDecodificaStatoPreferenzaSmall(codice: string): string {
    let descrizione: string;
    this._statiPreferenzaSmall.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getDecodificaPosizionePreferenza(codice: string): string {
    let descrizione: string;
    this._posizionePreferenza.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getDecodificaTipologiaFrequenza(codice: string, ordineScuola: string): string {
    let descrizione: string;
    if (ordineScuola == 'NID') {
      this._tipologiaFrequenzaNido.forEach(element => {
        if (element.codice === codice) {
          descrizione = element.descrizione;
        }
      });
    }

    if (ordineScuola == 'MAT') {
      this._tipologiaFrequenzaMaterna.forEach(element => {
        if (element.codice === codice) {
          descrizione = element.descrizione;
        }
      });
    }
    return descrizione;
  }

  getDecodificaTipologiaFrequenzaSmall(codice: string, ordineScuola: string): string {
    let descrizione: string;
    if (ordineScuola == 'NID') {
      this._tipologiaFrequenzaNidoSmall.forEach(element => {
        if (element.codice === codice) {
          descrizione = element.descrizione;
        }
      });
    }

    if (ordineScuola == 'MAT') {
      this._tipologiaFrequenzaMaternaSmall.forEach(element => {
        if (element.codice === codice) {
          descrizione = element.descrizione;
        }
      });
    }
    return descrizione;
  }

  getDecodificaFasceEta(codice: string): string {
    let descrizione: string;
    this._elencoFasceEta.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getElencoFasceEta(ordineScuola: string): Array<CodiceDescrizione> {
    if (ordineScuola == 'NID') {
      return this._elencoFasceEtaNido;
    }

    if (ordineScuola == 'MAT') {
      return this._elencoFasceEtaMaterna;
    }

    return [];
    
  }

  getElencoTipologieFrquenza(ordineScuola: string): Array<CodiceDescrizione> {
    if (ordineScuola == 'NID') {
      return this._tipologiaFrequenzaNido;
    }

    if (ordineScuola == 'MAT') {
      return this._tipologiaFrequenzaMaterna;
    }

    return [];
  }

  getStatiGraduatoria(): Array<CodiceDescrizione> {
    return this._statoGraduatoria;
  }
  getDecodificaStatoGraduatoria(codice: string): string {
    let descrizione: string = "undefined";
    this._statoGraduatoria.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getCondizioneCoabitazione(codice: string): string {

    let descrizione: string;
    this._condizioneCoabitazione.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getCondizioneOccupazionale(codice: string): string {

    let descrizione: string;
    this._condizioneOccupazionale.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getDecodifica(array: Array<CodiceDescrizione>, codice: string): string {

    let descrizione: string;
    array.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getSiNo(flag: boolean): string {
    if (flag === true) {
      return 'sì';
    } else {
      return 'no';
    }
  }

  // cambio residenza minore

  // fratello frequentante
  getFratelloFrequentateMinoreTipologia(codice: string): string {
    if (codice === 'FREQ') {
      return 'Frequentante';
    }
    if (codice === 'ISCR') {
      return 'Iscrivendo';
    }
    return 'undefined';
  }

  getRelazioneConMinore(codice: string): string {
    let descrizione: string;
    this._relazioneConMinore.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;

  }

  getRapportoParentelaConMinore(codice: string): string {
    let descrizione: string;
    this._rapportoParentelaConMinore.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;

  }

  getTipologiaFrequenzaScuola(codice: string, ordineScuola: string): string {
    let descrizione: string;
    if (ordineScuola == 'NID') {
      this._tipologiaFrequenzaNido.forEach(element => {
        if (element.codice === codice) {
          descrizione = element.descrizione;
        }
      });
    }

    if (ordineScuola == 'MAT') {
      this._tipologiaFrequenzaMaterna.forEach(element => {
        if (element.codice === codice) {
          descrizione = element.descrizione;
        }
      });
    }
    return descrizione;
  }

  getTipologiaIstruttoria(codice: string): string {
    let descrizione: string;
    this._tipoIstruttoria.forEach(element => {
      if (element.codice === codice) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getDesGenitoreSolo(stato: string): string {
    let descrizione: string;
    this._condizioneGenitoreSolo.forEach(element => {
      if (element.codice === stato) {
        descrizione = element.descrizione;
      }
    });
    return descrizione;
  }

  getStatoCondizionePunteggio(codiceVarizione: string): string {
    let descrizione: string;
    if (codiceVarizione === 'RIF') {
      descrizione = 'Non validata';
    } else if (codiceVarizione === 'VAL') {
      descrizione = 'Validata';
    } else if (codiceVarizione === null) {
      descrizione = 'Da validare';
    }
    return descrizione;
  }

  statoDomandaCodice(codice: string): string {
    if (codice === 'BOZ') {
      return 'Bozza';
    }
    else if (codice === 'INV') {
      return 'Inviata';
    }
    else if (codice === 'RIN') {
      return 'Rinuncia';
    }
    else if (codice === 'AMM') {
      return 'Ammessa';
    }
    else if (codice === 'ACC') {
      return 'Accettata';
    }
    else if (codice === 'RIT') {
      return 'Ritirata';
    }
    else if (codice === 'GRA') {
      return 'In graduatoria';
    }
    else if (codice === 'ANN') {
      return 'Annullata per rettifica';
    }
    else if (codice === 'CAN') {
      return 'Annullata dal richiedente';
    }

    return "";
  }

  isAmmissibile(codStatoScuola: string): boolean {
    if ('NON_AMM' === codStatoScuola) {
      return false;
    }
    return true;
  }

  //////////////////////////////////////////////////////////////////////

  findByCod(cod: string, values: CodiceDescrizione[]): CodiceDescrizione {
    if (cod && values) {
      for (let value of values) {
        if (value && value.codice === cod) {
          return value;
        }
      }
    }
    return null;
  }

}
