import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomandaService } from '../../service/domanda.service';
import { SrvError } from '../../model/common/srv-error';
import { formatDateConverter } from 'src/app/util/dateConverter';


import {
  DomandaNido,
  Richiedente,
  Minore,
  CondizioneOccupazionale,
  Anagrafica,
  LuogoNascita,
  Dipendente,
  Autonomo,
  Disoccupato,
  Studente,
  Soggetto1,
  Residenza,
  Gravidanza,
  ProblemiSalute,
  GenitoreSolo,
  Soggetto2,
  FratelloFrequentante,
  Trasferimento,
  Spostamento,
  Isee,
  ElencoNidi,
  Soggetto3,
  Soggetti,
  DatiIsee, CondizioniPunteggio
} from '../../model/common/domanda-nido';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DecodificaService } from '../../service/decodifica.service';
import { AuthService } from 'src/app/service/auth.service';
import { statoDomanda } from 'src/app/model/common/statoDomanda';
import { TestataDomanda } from 'src/app/model/common/testata-domanda';
import { AnagraficaGraduatorie } from 'src/app/model/common/AnagraficaGradautorie';
import { Location } from '@angular/common';
import { NodeCompatibleEventEmitter } from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'app-preferenze-scuola',
  templateUrl: './preferenze-scuola.component.html',
  styleUrls: ['./preferenze-scuola.component.css']
})
export class PreferenzeScuolaComponent implements OnInit {

  
  @Input()
  testataDomande: TestataDomanda[];
  
  codAnagraficaGraduatoria: string;
  globalError: boolean = false;
  nGra : number;
  prefList: statoDomanda [] = [];
  loadingError: boolean = false;

  codGraduatoria: number; 
  idDom: number;

  // il dettaglio
  domandaNido$: Observable<DomandaNido | SrvError>;
  domandaNido: DomandaNido;
  statusSearchDomanda = false;
  @Input() istruttoria = false;
  @Input() modificaPreferenze: boolean = true;

 /**
   * Getter specifici degli attributi per compattare il lor path e semplificare il binding in view sul template del componente
   */
  // Richiedente - begin
  get richiedente(): Richiedente {
    return this.domandaNido.richiedente;
  }

  // scelgo di decodificare staticamente i codici di relazione (nell'output del servizio NON sono presenti le decodifiche)
  get relazioneConMinoreText(): string {
    return this.decodificaService.getRelazioneConMinore(this.domandaNido.richiedente.relazioneConMinore);
  }

  // traduzione del flag boolean nella stringa sì/no
  get residenzaConMinoreText(): string {
    return this.decodificaService.getSiNo(this.domandaNido.minore.residenzaConRichiedente);
  }

  get presenzaNucleoMinoreText(): string {
    return this.decodificaService.getSiNo(this.domandaNido.minore.presenzaNucleo);
  }

  // decodifica statica di tutte le condizioni di coabitazione previste
  get condizioneCoabitazioneText(): string {
    return this.decodificaService.getCondizioneCoabitazione(this.domandaNido.richiedente.condizioneCoabitazione);
  }

  get anagraficaRichiedente(): Anagrafica {
    return this.domandaNido.richiedente.anagrafica;
  }

  get luogoNascitaRichiedente(): LuogoNascita {
    return this.domandaNido.richiedente.luogoNascita;
  }

  get luogoResidenzaRichiedente(): Residenza {
    return this.domandaNido.richiedente.residenza;
  }

  // Richiedente - end

  // Minore - begin
  get minore(): Minore {
    return this.domandaNido.minore;
  }

  get anagraficaMinore(): Anagrafica {
    return this.domandaNido.minore.anagrafica;
  }

  get luogoNascitaMinore(): LuogoNascita {
    return this.domandaNido.minore.luogoNascita;
  }

  get luogoResidenzaMinore(): Residenza {
    return this.domandaNido.minore.residenza;
  }

  get fratelloFrequentateMinore(): FratelloFrequentante {
    return this.domandaNido.minore.fratelloFrequentante;
  }

  get trasferimentoMinore(): Trasferimento {
    return this.domandaNido.minore.trasferimento;
  }

  get spostamentoMinore(): Spostamento {
    return this.domandaNido.minore.spostamento;
  }

  get cambioResidenzaMinoreText(): string {
    switch (this.spostamentoMinore.dati.stato) {
      case 'VAR_RES':
        return 'il nucleo familiare del minore ha fatto richiesta di variazione di residenza.';
      case 'APP_VAR_RES':
        return 'il nucleo familiare del minore ha appuntamento in anagrafe per variazione di residenza.';
      default:
        return 'il nucleo familiare del minore si trasferirà a Torino.';
    }
  }

  // Minore - end

  // per alcune condizioni richiedente=soggetto1 => quali?
  get isSoggetto1Richiedente(): boolean {
    if (this.richiedente.anagrafica.codiceFiscale === this.soggetto1.anagrafica.codiceFiscale) {
      console.log('Il soggetto1 coincide con il richiedente');
      return true;
    }
    console.log('Il soggetto1 diverso dal richiedente');
    return false;
  }

  // soggetto1 - begin
  get soggetto1(): Soggetto1 {
    return this.domandaNido.soggetto1;
  }

  get anagraficaSoggetto1(): Anagrafica {
    return this.domandaNido.soggetto1.anagrafica;
  }

  get luogoNascitaSoggetto1(): LuogoNascita {
    return this.domandaNido.soggetto1.luogoNascita;
  }

  get luogoResidenzaSoggetto1(): LuogoNascita {
    return this.domandaNido.soggetto1.residenza;
  }

  get gravidanzaSoggetto1(): Gravidanza {
    return this.domandaNido.soggetto1.gravidanza;
  }

  get problemiSaluteSoggetto1(): ProblemiSalute {
    return this.domandaNido.soggetto1.problemiSalute;
  }

  get condizioneOccupazionaleSoggetto1(): CondizioneOccupazionale {
    return this.domandaNido.soggetto1.condizioneOccupazionale;
  }

  get genitoreSoloSoggetto1(): GenitoreSolo {
    return this.domandaNido.soggetto1.genitoreSolo;
  }

  get genitoreSoloSoggetto1Sentenza(): boolean {
    if (this.domandaNido.soggetto1.genitoreSolo.sentenza) {
      if (!this.genitoreSoloSoggetto1SentenzaNumero && !this.genitoreSoloSoggetto1SentenzaTribunale &&
        !this.genitoreSoloSoggetto1SentenzaTribunale) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  get genitoreSoloSoggetto1SentenzaNumero(): boolean {
    if (!this.domandaNido.soggetto1.genitoreSolo.sentenza.numero || this.domandaNido.soggetto1.genitoreSolo.sentenza.numero === '') {
      return false;
    } else {
      return true;
    }
  }

  get genitoreSoloSoggetto1SentenzaTribunale(): boolean {
    if (!this.domandaNido.soggetto1.genitoreSolo.sentenza.tribunale || this.domandaNido.soggetto1.genitoreSolo.sentenza.tribunale === '') {
      return false;
    } else {
      return true;
    }
  }

  get genitoreSoloSoggetto1SentenzaData(): boolean {
    if (!this.domandaNido.soggetto1.genitoreSolo.sentenza.data || this.domandaNido.soggetto1.genitoreSolo.sentenza.data === '') {
      return false;
    } else {
      return true;
    }
  }

  // soggetto1 - end


  // soggetto2 - begin
  get soggetto2(): Soggetto2 {
    return this.domandaNido.soggetto2;
  }

  get anagraficaSoggetto2(): Anagrafica {
    return this.domandaNido.soggetto2.anagrafica;
  }

  get luogoNascitaSoggetto2(): LuogoNascita {
    return this.domandaNido.soggetto2.luogoNascita;
  }

  get luogoResidenzaSoggetto2(): LuogoNascita {
    return this.domandaNido.soggetto2.residenza;
  }

  get gravidanzaSoggetto2(): Gravidanza {
    return this.domandaNido.soggetto2.gravidanza;
  }

  get problemiSaluteSoggetto2(): ProblemiSalute {
    return this.domandaNido.soggetto2.problemiSalute;
  }

  get condizioneOccupazionaleSoggetto2(): CondizioneOccupazionale {
    return this.domandaNido.soggetto2.condizioneOccupazionale;
  }

  get tipoOccupazioneSoggetto2(): string {
    return this.domandaNido.soggetto2.condizioneOccupazionale.stato;
  }

  get soggetto2Dipendente(): Dipendente {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.dipendente;
  }

  get soggetto2Autonomo(): Autonomo {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.autonomo;
  }

  get soggetto2Disoccupato(): Disoccupato {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.disoccupato;
  }

  get soggetto2Studente(): Studente {
    return this.domandaNido.soggetto2.condizioneOccupazionale.dati.studente;
  }

  get presenzaNucleoSoggetto2(): String {
    return this.decodificaService.getSiNo(this.domandaNido.soggetto2.presenzaNucleo);
  }

  // soggetto2 - end

  // soggetto3 - begin

  get soggetto3(): Soggetto3 {
    if (this.domandaNido.soggetto3 != null && this.domandaNido.soggetto3.stato === true) {
      return this.domandaNido.soggetto3;
    }
    return null;
  }

  get anagraficaSoggetto3(): Anagrafica {
    return this.domandaNido.soggetto3.dati.anagrafica;
  }

  get luogoNascitaSoggetto3(): LuogoNascita {
    return this.domandaNido.soggetto3.dati.luogoNascita;
  }

  get luogoResidenzaSoggetto3(): LuogoNascita {
    return this.domandaNido.soggetto3.dati.residenza;
  }

  // soggetto3 - end

  // componenti nucleo
  get componentiNucleo(): Soggetti[] | null {
    if (this.domandaNido.componentiNucleo.soggetti != null && this.domandaNido.componentiNucleo.soggetti.length !== 0) {
      return this.domandaNido.componentiNucleo.soggetti;
    } else {
      return null;
    }
  }

  getRapportoParentelaConMinore(soggetto: Soggetti): string {
    return this.decodificaService.getRapportoParentelaConMinore(soggetto.relazioneConMinore);
  }

  // altri componenti
  get altriComponenti(): Soggetti[] | null {
    if (this.domandaNido.altriComponenti.soggetti != null && this.domandaNido.altriComponenti.soggetti.length !== 0) {
      return this.domandaNido.altriComponenti.soggetti;
    }
    return null;
  }

  // altri minori in affido
  get minoriAffido(): Soggetti[] | null {
    if (this.domandaNido.affido.soggetti != null && this.domandaNido.affido.soggetti.length !== 0) {
      return this.domandaNido.affido.soggetti;
    } else {
      return null;
    }
  }

  // affido

  // isee
  get isee(): Isee {
    return this.domandaNido.isee;
  }

  get datiIsee(): DatiIsee {
    return this.domandaNido.isee.dati;
  }

  get iseeStatoText(): string {
    if (this.isee.stato) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  condizioneValidita(condizione: CondizioniPunteggio): string {
    if (condizione.validata === true) {
      return 'Si';
    } else if (condizione.validata === false) {
      return 'No';
    }
    // } else if (condizione.validata === null) {
    //   return 'Da validare';
    // }
  }

  // elenco nidi
  get elencoNidi(): ElencoNidi[] | null {
    if (this.domandaNido.elencoNidi != null
      && this.domandaNido.elencoNidi.length !== 0) {
      return this.domandaNido.elencoNidi;
    }
    return null;
  }

  // elenco nidi
  get condizioniPunteggio(): CondizioniPunteggio[] | null {
    if (this.domandaNido.condizioniPunteggio != null
      && this.domandaNido.condizioniPunteggio.length !== 0) {
      return this.domandaNido.condizioniPunteggio;
    }
    return null;
  }

  get domandaIscrizione(): any {
    return this.domandaNido.idDomandaIscrizione
  }

  get nDomandaIscrizione(): any {
    return this.domandaNido.protocolloDomandaIscrizione
  }

  get statoDomanda(): any {
   
    let stato= this.domandaNido.statoDomanda
    let descStato;
    
    if(stato == "BOZ"){ descStato="Bozza" }
    if(stato == "INV"){ descStato="Inviata" }
    if(stato == "RIN"){ descStato="Rinunciata" }
    if(stato == "AMM"){ descStato="Ammessa" }
    if(stato == "ACC"){ descStato="Accettata" }
    if(stato == "RIT"){ descStato="Ritirata" }
    if(stato == "GRA"){ descStato="In graduatoria" }
    if(stato == "ANN"){ descStato="Annullata per rettifica" }
    if(stato == "CAN"){ descStato="Annullata dal richiedente" }



    return  descStato
  }
  
  getTipologiaIstruttoria(condizione: CondizioniPunteggio): string {
    return this.decodificaService.getTipologiaIstruttoria(condizione.tipoIstruttoria);
  }

  getDesGenitoreSolo(stato: string): string {
    return this.decodificaService.getDesGenitoreSolo(stato);
  }


  constructor(
    private location: Location,
    private domandaService: DomandaService,
    private decodificaService: DecodificaService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {

    /**
     * mancano 
     * graduatoria //domande/domanda/num.protocolloDomandaIscrizione
     * data nascita minore /domande/domanda/num.minore.anagrafica.dataNascita
     * codice fiscale del richiedente /domande/domanda/num.richiedente.anagrafica.codiceFiscale
     * cognome e nome richiedente                                 .anagrafica.nome .cognome
     * stato domanda  /domande/domanda/num.statoDomanda
     */

   
    this.initCodGraduatoria();
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    const idDomanda = this.route.snapshot.paramMap.get("id")
    this.idDom = +idDomanda;
   
    this.domandaService.getDomandaById(ordineScuola, +idDomanda).subscribe(
      (res: DomandaNido) => {
        console.log(res)
      }
    )

    this.authService.checkOperatoreAbilitato();
    this.statusSearchDomanda = true;
    this.domandaNido$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.domandaService.getDomandaById(ordineScuola, parseInt(params.get('id')))
      )
    );
    // richiamo il dettaglio della domanda sul service della domanda
    this.domandaNido$.subscribe({
      next: (data: DomandaNido) => {
        this.domandaNido = data;
        console.log('domandaNido: ' + JSON.stringify(this.domandaNido));
        //this.statusSearchDomanda = false;
      },
      error: (data: SrvError) => {
        console.log('Errore: ' + JSON.stringify(data));
        this.statusSearchDomanda = false;

        this.globalError = true;
        setTimeout(() => {
          this.globalError = false;
        }, 9000);
      },
    });

  
  }


  select(pref : statoDomanda){

   
    
    let codAnagraficaGraduatoria = this.codAnagraficaGraduatoria;
    let idGraduatoria = pref.idGraduatoria;
    let idDomandaIscrizione = pref.idDomandaIscrizione;
    let ordinePreferenza = pref.ordinePreferenza;
    let codScuola = pref.codScuola;
    let descScuola = pref.descScuola;
    let indirizzo = pref.indirizzo;
    let idTipoFrequenza = pref.idTipoFrequenza;
    let codTipoFrequenza = pref.codTipoFrequenza;
    let descTipoFre = pref.descTipoFre;
    let idStatoScu = pref.idStatoScu;
    let codStatoScu = pref.codStatoScu;
    let descStatoScu = pref.descStatoScu;
    let dtStato = pref.dtStato; 

    console.log(this.domandaNido.idDomandaIscrizione)
    this.router.navigate([`/domande/domanda/${this.domandaNido.idDomandaIscrizione}/preferenze/modifica`], {
       queryParams: { 
         codAnagraficaGraduatoria: codAnagraficaGraduatoria,
         idGraduatoria: idGraduatoria,
         idDomandaIscrizione : idDomandaIscrizione,
         ordinePreferenza: ordinePreferenza,
         codScuola: codScuola,
         descScuola: descScuola,
         indirizzo: indirizzo,
         idTipoFrequenza: idTipoFrequenza,
         codTipoFrequenza: codTipoFrequenza,
         descTipoFre: descTipoFre,
         idStatoScu: idStatoScu,
         codStatoScu: codStatoScu,
         descStatoScu: descStatoScu,
         dtStato: dtStato
          
        } 
    });
  }

  private initCodGraduatoria(): void{

    this.domandaService.getAnagraficaGraduatoria().subscribe({
      next: (res: AnagraficaGraduatorie[]) => {
        if (res) {
          let items2: AnagraficaGraduatorie[] = [];

          let dataRec = new Date("1900-01-01");
          for (let item2 of res) {
            items2.push({
              idAnagraficaGraduatoria: item2.idAnagraficaGraduatoria,
              codAnagraficaGraduatoria: item2.codAnagraficaGraduatoria,
              codAnnoScolastico: item2.codAnnoScolastico,
              codOrdineScuola: item2.codOrdineScuola,
              dataInizioIscrizioni: item2.dataInizioIscrizioni,
              dataScadenzaIscrizioni: item2.dataScadenzaIscrizioni,
              dataFineIscrizioni: item2.dataFineIscrizioni,
              dataScadenzaGraduatoria: item2.dataScadenzaGraduatoria,
              dataScadenzaRicorsi: item2.dataScadenzaRicorsi       
            });
            
            // let dataGRA = new Date(+item2.dataScadenzaGraduatoria);
            // if(dataGRA >= dataRec && item2.codOrdineScuola == "NID" ){
              
            //   dataRec  = dataGRA;
            //   this.codAnagraficaGraduatoria = item2.codAnagraficaGraduatoria;
            //   this.codGraduatoria = item2.idAnagraficaGraduatoria;
            //   console.log("sono entrato ora stampo codGraduatoria: "+ this.codGraduatoria)
            // }

          }

          
          let filtroOrdineScuola = items2.filter(o =>{
            return o.codOrdineScuola == sessionStorage.getItem('ordineScuola')

          })

          let today = new Date();
          let statoDomandaFiltrato = filtroOrdineScuola.filter(x => {
            let dataOggetto = new Date(x.dataScadenzaGraduatoria);
             
          
            return dataOggetto.getTime()>=today.getTime() 
            
          })
          

          let statoDomandaOrdinato = statoDomandaFiltrato.sort((x,y)=>{
            let dtX = new Date(x.dataScadenzaGraduatoria)
            let dtY = new Date(y.dataScadenzaGraduatoria)
            return dtX.getTime()-dtY.getTime()
          })
      
          this.codGraduatoria = statoDomandaOrdinato[0].idAnagraficaGraduatoria;
          this.codAnagraficaGraduatoria =statoDomandaOrdinato[0].codAnagraficaGraduatoria;






          this.initPrefList(this.codGraduatoria,this.idDom);

      
          
        }
       
      },
      error: (response: SrvError) => {
        this.statusSearchDomanda = false;
        this.showLoadingError();
      }
    });


  }

  private initPrefList(idAnagraficaGraduatoria : number, idDomanda: number): void {

    
    console.log("CG: "+ this.codGraduatoria);
    console.log("idDomanda: "+ this.idDom)
   
    
    //this.codGraduatoria = 1;

  

    this.domandaService.getPreferenzeScuole(idAnagraficaGraduatoria, idDomanda).subscribe({
     
        next: (response: statoDomanda[]) => {
  
          if (response) {
            let items: statoDomanda[] = [];
            for (let item of response) {
              items.push({
                idGraduatoria : item.idGraduatoria,
                idDomandaIscrizione : item.idDomandaIscrizione,
                ordinePreferenza : item.ordinePreferenza,
                codScuola : item.codScuola,
                descScuola : item.descScuola,
                indirizzo : item.indirizzo,
                idTipoFrequenza : item.idTipoFrequenza,
                codTipoFrequenza : item.codTipoFrequenza,
                descTipoFre : item.descTipoFre,
                idStatoScu : item.idStatoScu,
                codStatoScu : item.codStatoScu,
                descStatoScu : item.descStatoScu,
                dtStato : new Date(item.dtStato).toLocaleDateString()
              });
            }
            this.prefList = items;
            this.codScuolaLinkabile(this.prefList)
            this.statusSearchDomanda = false;
          }
         
        },
        error: (response: SrvError) => {
          this.statusSearchDomanda = false;
          this.showLoadingError();
        }
      });
  
      
    
  }

  private showLoadingError(): void {
    this.loadingError = true;
    setTimeout(() => {
      this.loadingError = false;
    }, 9000);
  }
  indietroOnClick(){
    this.location.back();
  }
  private codScuolaLinkabile(statoD: statoDomanda[]): void{
      

    for(let cod of statoD){
      //caso in cui idStatoScu = AMM
      if(cod.idStatoScu == 3){
        this.nGra = cod.idGraduatoria;
        return ;
      }
      //caso in cui idStatoScu = ACC
      if(cod.idStatoScu == 4){
        this.nGra = cod.idGraduatoria;
        return;
      }
    }


    let today = new Date();
    let statoDomandaFiltrato = statoD.filter(x => {
      let dataOggetto = new Date(formatDateConverter(x.dtStato));
       //caso in cui idStatoScu = RIN o RIN auto
      if(x.idStatoScu == 2 || x.idStatoScu == 8)
        return dataOggetto.getTime()<=today.getTime() 
      else return false
    })
    
    let statoDomandaOrdinato = statoDomandaFiltrato.sort((x,y)=>{
      let dtX = new Date(formatDateConverter(x.dtStato))
      let dtY = new Date(formatDateConverter(y.dtStato))
      return dtY.getTime()-dtX.getTime()
    })

    if(statoDomandaOrdinato[0])
      this.nGra = statoDomandaOrdinato[0].idGraduatoria;
}


}
