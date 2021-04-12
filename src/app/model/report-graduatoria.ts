export class GraduatoriaCompleta {
    codFasciaEta: string;
    protocollo: string;
    punteggio: number;
    nome: string;
    cognome: string;
    codiceFiscale: string;
    isee: number;
    dataConsegna: Date;
    dataNascita: Date;
    oraNascita: string;
    pref1: string;
    pref2: string;
    pref3: string;
    pref4: string;
    pref5: string;
    pref6: string;
    pref7: string;
    pref8: string;
    pref9: string;
    pref10: string;
}

export class GraduatoriaApprovazione {
    protocollo: string;
    dataConsegna: Date;
    codFasciaEta: string;
    cognome: string;
    nome: string;
    dataNascita: Date;
    oraNascita: string;
    isee: number;
    punteggioPrimaScelta: number;
    punteggio: number;
    flFuoriTermine: string;
    idDomandaIscrizione: number;
}
