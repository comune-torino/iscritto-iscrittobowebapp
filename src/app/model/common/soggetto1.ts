import { AnagraficaSoggetto } from "./anagrafica-soggetto";
import { Luogo } from "./luogo";
import { CondizioneOccupazionale } from "./condizione-occupazionale";

export class Soggetto1 {

    anagrafica: AnagraficaSoggetto;
    luogoNascita: Luogo;
    gravidanza: boolean;
    problemiSalute: boolean;
    condizioneOccupazionale: CondizioneOccupazionale;

}