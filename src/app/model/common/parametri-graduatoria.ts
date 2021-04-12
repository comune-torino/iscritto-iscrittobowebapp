/**
 * Classe che rappresenta i parametri di individuazione di una graduatoria nel sistema ISCRITTO
 */
export class ParametriGraduatoria {
    // codifica alfanumerica a sistema della graduatoria
    codice: string;
    // il numero dello step corrente di graduatoria
    step: number;
    // lo stato attuale della graduatoria
    codiceStato: string;
    
    // la data ultimo calcolo della graduatoria
    dataUltimoCalcolo: string;

    // flag che indica la possibilità di calcolare le ammissioni
    ammissioni: boolean;
  }
