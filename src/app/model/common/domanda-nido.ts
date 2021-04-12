export interface Anagrafica {
  nome: string;
  cognome: string;
  codiceFiscale: string;
  dataNascita: string;
  oraMinutiNascita: string;
  sesso: string;
  descrizioneCittadinanza: string;
}

export interface LuogoNascita {
  codNazione: string;
  descNazione: string;
  codRegione: string;
  descRegione: string;
  codProvincia: string;
  descProvincia: string;
  codComune: string;
  descComune: string;
}

export interface Residenza {
  codNazione: string;
  descNazione: string;
  codRegione: string;
  descRegione: string;
  codProvincia: string;
  descProvincia: string;
  codComune: string;
  descComune: string;
  cap: string;
  indirizzo: string;
}

export interface Richiedente {
  anagrafica: Anagrafica;
  luogoNascita: LuogoNascita;
  residenza: Residenza;
  email: string;
  telefono: string;
  residenzaFutura: string;
  recapitoNoResidenza?: any;
  relazioneConMinore: string;
  condizioneCoabitazione: string;
}

export interface File {
  name: string;
  type: string;
}

export interface Documenti {
  id: number;
  file: File;
}

export interface Disabilita {
  stato: boolean;
  documenti: Documenti[];
}

export interface DatiServiziSociali {
  assistente: string;
  nome: string;
  indirizzo: string;
  telefono: string;
}

export interface ServiziSociali {
  stato: boolean;
  dati: DatiServiziSociali;
  documenti: Documenti[];
}


export interface ProblemiSalute {
  stato: boolean;
  documenti: Documenti[];
}


export interface FratelloFrequentante {
  stato: boolean;
  tipo: string;
  anagrafica: Anagrafica;
}

export interface DatiTrasferimento {
  data: string;
  indirizzoVecchio: string;
  indirizzoNuovo: string;
  indirizzoNido: string;
  dataDal: string;
  dataAl: string;
}

export interface Trasferimento {
  stato: boolean;
  dati: DatiTrasferimento;
}

export interface DatiSpostamento {
  stato: string;
  dataVariazione: string;
  dataAppuntamento: string;
  residenzaFutura: string;
  indirizzo: string;
}

export interface Spostamento {
  stato: boolean;
  dati: DatiSpostamento;
}

export interface Minore {
  presenzaNucleo: boolean;
  residenzaConRichiedente: boolean;
  anagrafica: Anagrafica;
  luogoNascita: LuogoNascita;
  residenza: Residenza;
  disabilita: Disabilita;
  serviziSociali: ServiziSociali;
  problemiSalute: ProblemiSalute;
  fratelloFrequentante: FratelloFrequentante;
  trasferimento: Trasferimento;
  spostamento: Spostamento;
  id: string;
  cinqueAnniNonFrequentante: string;
  listaAttesa: ListaAttesa;
  fratelloNidoContiguo: NidoContiguo;
}

export interface ListaAttesa {
  stato: boolean;
  dati: DatiListaAttesa;
}

export interface DatiListaAttesa {
  primoAnno: DatiAnnoListaAttesa;
  secondoAnno: DatiAnnoListaAttesa;
}

export interface DatiAnnoListaAttesa {
  annoScolastico: string;
  scuola: string;
}

export interface NidoContiguo {
  stato: boolean;
  anagrafica: Anagrafica;
  nidoContiguo: DatiNidoContiguo;
}

export interface DatiNidoContiguo {
  descrizione: string;
  indirizzo: string;
}

export interface Gravidanza {
  stato: boolean;
  documenti: any[];
}

export interface Dipendente {
  azienda: string;
  comune: string;
  provincia: string;
  indirizzo: string;
}

export interface Autonomo {
  piva: string;
  comune: string;
  provincia: string;
  indirizzo: string;
}

export interface DatiCi {
  comune: string;
  provincia: string;
}

export interface Disoccupato {
  dataDichiarazione: string;
  soggettoDichiarazione: string;
  datiCi: DatiCi;
}

export interface NonOccupato {
  id?: any;
  azienda: string;
  comune: string;
  indirizzo: string;
  dataInizio: string;
  dataFine: string;
}

export interface Studente {
  istituto: string;
  corso: string;
}

export interface DatiCondizioneOccupazionale {
  dipendente: Dipendente;
  autonomo: Autonomo;
  disoccupato: Disoccupato;
  nonOccupato: NonOccupato[];
  studente: Studente;
}

export interface CondizioneOccupazionale {
  stato: string;
  dati: DatiCondizioneOccupazionale;
}

export interface Sentenza {
  numero: string;
  data: string;
  tribunale: string;
}

export interface GenitoreSolo {
  stato: string;
  sentenza: Sentenza;
}

export interface Soggetto1 {
  anagrafica: Anagrafica;
  luogoNascita: LuogoNascita;
  residenza: Residenza;
  gravidanza: Gravidanza;
  problemiSalute: ProblemiSalute;
  disabilita: Disabilita;
  serviziSociali: ServiziSociali;
  condizioneOccupazionale: CondizioneOccupazionale;
  genitoreSolo: GenitoreSolo;
  id: any;
}


export interface Soggetto2 {
  presenzaNucleo: boolean;
  anagrafica: Anagrafica;
  luogoNascita: LuogoNascita;
  residenza: Residenza;
  gravidanza: Gravidanza;
  problemiSalute: ProblemiSalute;
  disabilita: Disabilita;
  serviziSociali: ServiziSociali;
  condizioneOccupazionale: CondizioneOccupazionale;
  id: any;
}


export interface Soggetto3 {
  dati: DatiSoggetto3;
  stato: boolean;
  id: any;
}

export interface DatiSoggetto3 {
  anagrafica: Anagrafica;
  luogoNascita: LuogoNascita;
  residenza: Residenza;
  gravidanza: Gravidanza;
  problemiSalute: ProblemiSalute;
  disabilita: Disabilita;
  serviziSociali: ServiziSociali;
  condizioneOccupazionale: CondizioneOccupazionale;
}


export interface Soggetti {
  id?: any;
  relazioneConMinore: string;
  anagrafica: Anagrafica;
  luogoNascita: LuogoNascita;
  problemiSalute: ProblemiSalute;
  disabilita: Disabilita;
  serviziSociali: ServiziSociali;
  sentenza: Sentenza;
}

export interface ComponentiNucleo {
  soggetti: Soggetti[];
}

export interface AltriComponenti {
  stato: boolean;
  soggetti: Soggetti[];
}


export interface Affido {
  stato: boolean;
  soggetti: Soggetti[];
}

export interface DatiIsee {
  valore: number;
  dataAttestazione: string;
}

export interface Isee {
  stato: boolean;
  dati: DatiIsee;
}

export interface ElencoNidi {
  id: number;
  codCircoscrizione: string;
  codScuola: string;
  descrizione: string;
  indirizzo: string;
  codTipoFrequenza: string;
  codCategoriaScuola: string;
  punteggio: string;
  fuoriTermine: boolean;
  posizione: string;
  codStatoScuola: string;
  descStatoScuola: string;
  ammissibile: boolean;
}

export interface CondizioniPunteggio {
  codice: string;
  descrizione: string;
  ricorrenza: string;
  tipoIstruttoria: string;
  cognomeUtente: string;
  dataInizioValidita: string;
  note: string;
  validata: boolean;
}

export interface DomandaNido {
  idDomandaIscrizione: any;
  protocolloDomandaIscrizione?: string;
  statoDomanda: string;
  ordineScuola: string;
  annoScolastico: string;
  consensoConvenzionata: boolean;
  responsabilitaGenitoriale: boolean;
  infoAutocertificazione: boolean;
  infoGdpr: boolean;
  richiedente: Richiedente;
  minore: Minore;
  soggetto1: Soggetto1;
  soggetto2: Soggetto2;
  soggetto3: Soggetto3;
  componentiNucleo: ComponentiNucleo;
  altriComponenti: AltriComponenti;
  affido: Affido;
  isee: Isee;
  elencoNidi: ElencoNidi[];
  condizioniPunteggio: CondizioniPunteggio[];
  flIrc: string;
}



