import { PeriodoLavoro } from "./periodo-lavoro";
import { Dipendente, Autonomo, Disoccupato, Studente } from "./domanda-nido";

export class CondizioneOccupazionale {
    stato: string;
    dipendente: Dipendente;
    autonomo: Autonomo;
    disoccupato: Disoccupato;
    nonOccupatoList: PeriodoLavoro[];       
    studente:Studente;
}