import {Richiedente} from './richiedente';
import {Minore} from './minore';
import {Soggetto2} from './soggetto2';
import {Soggetto1} from './soggetto1';
import {genitoreSolo} from './genitore-solo';
import {CodiceDescrizione} from './codice-descrizione';

/**
 * DTO relativo al ComplexType UserInfo.
 * @generated
 */

export class DettaglioDomanda {

  idDomandaIscrizione: number;
  statoDomanda: CodiceDescrizione;
  ordineScuola: CodiceDescrizione;
  responsabilitaGen: boolean;
  infoAutocertificazione: boolean;
  infoGdpr: boolean;
  codAnnoScolastico: string;
  richiedente: Richiedente;
  minore: Minore;
  soggetto1: Soggetto1;
  genitoreSolo: genitoreSolo;
  soggetto2: Soggetto2;
}
