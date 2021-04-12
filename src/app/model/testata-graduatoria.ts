
/**
 * Classe che rappresenta i parametri di individuazione di una graduatoria nel sistema ISCRITTO
 */
export class TestataGraduatoria {

  // posizione nell graduatoria 
  posizione: string;

  // punteggio dell preferenza
  punteggio: number;

  // lo stato attuale della graduatoria corrente
  isee: string;

  // protocollo Domanda
  protocollo: string;

  // cognome del minore
  cognomeMinore: string;

  // nome del minore
  nomeMinore: string;

  // la data nascita  del minore
  dataNascitaMinore: string;

  // frequenza
  tipologiaFrequenza: string;

  // preferenza
  preferenza: string;

  // scelta preferenza (1, 2, ...)
  sceltaPreferenza: string;

  // scelta preferenza (prima, seconda, ...)
  descSceltaPreferenza: string

  // stato preferenza
  statoPreferenza: string;

  // elenco preferenze
  preferenze: Preferenza[];
}

export class Preferenza {
  codScuola: string;
  descrizione: string;
  indirizzo: string;
  codTipoFrequenza: string;
  codCategoriaScuola: string;
  codStatoScuola: string;
  punteggio: number;
  posizione: number;
}
