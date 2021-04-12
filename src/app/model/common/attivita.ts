import { CodiceDescrizione } from "./codice-descrizione";


export class Attivita {
  codice: string = null;
  descrizione: string = null;
  codiceTipo: string = null;
  codiceFunzione = null;
  link: string = null;
  privilegi: CodiceDescrizione[];
}
