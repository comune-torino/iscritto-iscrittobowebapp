export class InfoCalcoloGraduatoria {
    domandeNonIstruite: number;
    verifichePreventivePendenti: InfoVerifiche[];
}

export class InfoVerifiche {
    codiceCondizione: string;
    descrizioneCondizione: string;
    codiceTipoVerifica: string;
    occorrenze: number;
}

export class ParamatriCalcoloGraduatoria {
    codiceGraduatoria: string;
    codiceStatoGraduatoria: string;
    stepGraduatoria: number;
    codiceOrdineScuola: string;
    codiceStatoDaCalcolare: string;
}
