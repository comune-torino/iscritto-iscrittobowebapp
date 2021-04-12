import { CodiceDescrizione } from './codice-descrizione';

/*
DTO che implementa la riga master della domanda (attributi di testata)
*/
export class TestataDomanda {
  idSoggettoMinore: number;
  idDomandaIscrizione: number;
  protocolloDomandaIscrizione: string;
  nomeMinore: string = null;
  cognomeMinore: string = null;
  codiceFiscaleMinore: string = null;
  statoDomandaCodice: string;
  statoDomandaDescrizione: string;
  dataUltimaModifica: string;
  nomeUtenteUltimaModifica: string;
  cognomeUtenteUltimaModifica: string;
}

export class TestataDomandaDaVerificare {
  idDomandaIscrizione: number;
  protocollo: string;
  codStatoDomanda: string;
  nomeMinore: string;
  cognomeMinore: string;
  codiceFiscaleMinore: string;
  paDis: boolean;
  paPrbSal: boolean;
}
