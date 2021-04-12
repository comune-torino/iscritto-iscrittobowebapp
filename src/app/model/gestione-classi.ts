export class AnnoScolastico {
    codiceAnnoScolastico: string;
    descrizione: string;
    dataDa: string;
    dataA: string;
}

export class OrdineScuola {
    codOrdineScuola: string
    descrizione: string
}

export class Classe {
    idClasse: number;
    postiLiberi: number;
    postiAmmessi: number;
    postiAccettati: number;
    denominazione: string;
    flAmmissioneDis: string;
    codFasciaEta: string;
    codScuola: string;
    codOrdineScuola: string;
    codAnnoScolastico: string;
    codTipoFrequenza: string;
}

export class ClasseParam {
    idClasse: number;
    postiLiberi: number;
    postiAmmessi: number;
    denominazione: string;
    ammissioneDis: boolean;
    codFasciaEta: string;
    codScuola: string;
    codAnnoScolastico: string;
    codTipoFrequenza: string;
}
export class ClasseAnagraficaGraduatoria {
    // idAnagraficaGraduatoria: number;
    codAnagraficaGraduatoria: string;
    codAnnoScolastico: string;
    codOrdineScuola: string
    dataInizioIscrizioni: string;
    dataScadenzaIscrizioni: string
    dataFineIscrizioni: string;
    dataScadenzaGraduatoria: string;
    dataScadenzaRicorsi: string;
}

export class AmmissioniParam {
    idClasseList: number[];
    value: boolean;
}

export class InfoResidenzeForzate {
    codGraduatoria: string;
    codTipoScuola: string;
    idStepGra: number;
    idStepGraCon: number;
    residenzeForzate: ResidenzaForzata[];
}

export class ResidenzaForzata {
    protocollo: string;
    codiceFiscale: string;
    cognome: string;
    nome: string;
    codFasciaEta: string;
    codScuola: string;
    descScuola: string;
    indirizzo: string;
    codOrdineScuola: string;
}
