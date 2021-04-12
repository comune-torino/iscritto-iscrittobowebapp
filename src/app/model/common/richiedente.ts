import { AnagraficaSoggetto } from "./anagrafica-soggetto";
import { Residenza } from "./residenza";
import { Luogo } from "./luogo";
import { CodiceDescrizione } from "./codice-descrizione";

/**
 * DTO relativo al ComplexType Richiedente.
 * @generated 
 */




export class Richiedente {
    email: string;
    residenzaFutura: Residenza;
    recapitoNoResidenza: string;
    presenzaMinoreNucleo: boolean;
    residenzaConMinore: boolean;
    relazioneConMinore: CodiceDescrizione;
    condizioneCoabitazione: CodiceDescrizione;
    anagrafica: AnagraficaSoggetto;
    luogoNascita: Luogo;
    luogoResidenza: Luogo;
}