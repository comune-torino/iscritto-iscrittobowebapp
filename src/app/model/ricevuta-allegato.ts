import { DatePipe } from "@angular/common";

export class RicevutaAllegato {
    codOrdineScuola: string;
    codAnnoScolastico: string;
    protocolloDomanda: string;
    cognomeMinore: string;
    nomeMinore: string;
    descTipoAllegato: string;
    protocolloAllegato: string;
    nomeFile: string;
    dataOperazione: string;

    getPrintable() {
        // var logo; //TODO
        // var ordine: string; //11111
        // var anno; //22222
        // var protocollo; //333333
        // var cognomeMinore; //44444
        // var nomeMinore; //555555
        // var descrizioneAllegato; //66666
        // var protocolloAllegato; //7777
        // var nomeFile; //88888
        // var dataOperazione; //99999

        var ordine = "";
        if(this.codOrdineScuola == "NID") {
          ordine = "<center>RICEVUTA INSERIMENTO ALLEGATI</center><center> PER DOMANDA D’ISCRIZIONE AI NIDI D’INFANZIA COMUNALI E CONVENZIONATI</center>"
        } else if (this.codOrdineScuola == "MAT") {
          ordine = "<center>RICEVUTA INSERIMENTO ALLEGATI</center><center> PER DOMANDA D’ISCRIZIONE ALLESCUOLED’INFANZIA COMUNALI, CONVENZIONATE E STATALI</center>"
        } else {
          console.error("codOrdine invalido")
          return;
        }

        var printRicevuta = `${ordine}<center>ANNO SCOLASTICO ${this.codAnnoScolastico} </center><br><br><br>Avvenuto inserimento allegato alla domanda n° ${this.protocolloDomanda} presentata per la bambina/il bambino Cognome ${this.cognomeMinore} &nbsp&nbsp&nbsp&nbsp Nome ${this.nomeMinore}<br>Riguardante la ${this.descTipoAllegato}<br><br>Protocollo allegato: ${this.protocolloAllegato}<br>Nome file allegato: ${this.nomeFile}<br><br><br> data &nbsp${this.dataOperazione} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp________________________________________________  <center> (firma della persona preposta al caricamento degli allegati)</center><br>Potrai vedere gli allegati inseriti alla voce “Le tue domande”, all’interno della pagina “Servizi 0-6: iscrizione nidi d’infanzia” di Torino Facile`
        return printRicevuta;
    }

    clone(r: RicevutaAllegato, datePipe: DatePipe) {
        this.codOrdineScuola = r.codOrdineScuola;
        this.codAnnoScolastico = r.codAnnoScolastico;
        this.protocolloDomanda = r.protocolloDomanda;
        this.cognomeMinore = r.cognomeMinore;
        this.nomeMinore = r.nomeMinore;
        this.descTipoAllegato = r.descTipoAllegato;
        this.protocolloAllegato = r.protocolloAllegato;
        this.nomeFile = r.nomeFile;
        this.dataOperazione = datePipe.transform(new Date(r.dataOperazione), "dd/MM/yyyy")
    }
}