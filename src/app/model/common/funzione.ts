import {Attivita} from './attivita';
import {CodiceDescrizione} from './codice-descrizione';

// Classe che mappa gli attributi di una macro funzionalità applicativa (di primo livello)
export class Funzione {
  codice: string = null;
  descrizione: string = null;
  link: string = null;
  attivita: Attivita[] = null;
}
