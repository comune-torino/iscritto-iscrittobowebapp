import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, Form } from '@angular/forms';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { SrvError } from 'src/app/model/common/srv-error';
import { AnnoScolastico, ClasseAnagraficaGraduatoria } from 'src/app/model/gestione-classi';
import { AuthService } from 'src/app/service/auth.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { Richiedente } from 'src/app/model/common/richiedente';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';



@Component({
  selector: 'app-inserimento-anagrafica',
  templateUrl: './inserimento-anagrafica.component.html',
  styleUrls: ['./inserimento-anagrafica.component.css']
})
export class InserimentoAnagraficaComponent implements OnInit {

  // caricamento pagina
  statusSearch: boolean = false;

  // errori
  loadingError: boolean = false;
  insertError: boolean = false;
  updateError: boolean = false;
  deleteError: boolean = false;
  classePresenteError: boolean = false;
  modifica: boolean = false;
  inserimento: boolean = false;

  ordineScuola : string ="";
  ordineScuolaDescrizione: string = ""
  annoScolastico : string ="";
  codGraduatoria: string = "";

  inserimentoString = "Inserimento Anagrafica"
  modificaString = "Modifica Anagrafica"
  title: string = this.inserimentoString


  // stati visualizzazione
  viewInserisci: boolean = false;

  fgInserimentoAnagrafica: FormGroup = new FormGroup({});
  
  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];


  constructor(
    private location : Location,
    private graduatoriaService: GraduatoriaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private config: ConfigService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.showInserisci();

    
    this.ordineScuola = this.route.snapshot.queryParamMap.get('codOrdine');
    this.ordineScuolaDescrizione = this.route.snapshot.queryParamMap.get('descOrdine');
    this.annoScolastico = this.route.snapshot.queryParamMap.get('anno');
    this.codGraduatoria = this.route.snapshot.queryParamMap.get("codGraduatoria");

    this.fgInserimentoAnagrafica.addControl('codiceGraduatoria', new FormControl(null, [Validators.required]));
    this.fgInserimentoAnagrafica.addControl('dataInizioIscrizione', new FormControl(null));
    this.fgInserimentoAnagrafica.addControl('dataFineIscrizione', new FormControl(null));
    this.fgInserimentoAnagrafica.addControl('dataScadenzaIscrizione', new FormControl(null));
    this.fgInserimentoAnagrafica.addControl('dataScadenzaGraduatoria', new FormControl(null));
    this.fgInserimentoAnagrafica.addControl('dataScadenzaRicorsi', new FormControl(null));    

    this.fgInserimentoAnagrafica.addControl('ordineScuola', new FormControl(null, [Validators.required]));    
    this.fgInserimentoAnagrafica.addControl('annoScolastico', new FormControl(null, [Validators.required]));    

    this.fgInserimentoAnagrafica.setValidators(inserimentoAnagraficaValidator)

    if (this.codGraduatoria != "") {
      //e' una modifica
      this.title = this.modificaString
      this.fgInserimentoAnagrafica.get("codiceGraduatoria").setValue(this.codGraduatoria) 

      this.modifica = true;
      this.codiceGraduatoriaValidate(this.codGraduatoria)

      
    } else {
      //e' un inserimento
    }
  }

  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////

  showInserisci(): void {

    this.viewInserisci = true;
  }

  //////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////
  


  private showLoadingError(): void {
    this.loadingError = true;
    setTimeout(() => {
      this.loadingError = false;
    }, 9000);
  }

  returnSearch() {
    this.location.back();
  }

  private updateAnagraficaGraduatoria(): void {
    let params = new ClasseAnagraficaGraduatoria();
    params.codAnagraficaGraduatoria = this.fgInserimentoAnagrafica.value.codiceGraduatoria;
    params.codAnnoScolastico = this.annoScolastico ;
    params.codOrdineScuola = this.ordineScuola;
    params.dataInizioIscrizioni = this.fgInserimentoAnagrafica.value.dataInizioIscrizione;
    params.dataScadenzaIscrizioni = this.fgInserimentoAnagrafica.value.dataScadenzaIscrizione;
    params.dataFineIscrizioni = this.fgInserimentoAnagrafica.value.dataFineIscrizione;
    params.dataScadenzaGraduatoria = this.fgInserimentoAnagrafica.value.dataScadenzaGraduatoria;
    params.dataScadenzaRicorsi = this.fgInserimentoAnagrafica.value.dataScadenzaRicorsi;
    

    if (params.codAnagraficaGraduatoria &&
      params.codAnnoScolastico &&
      params.codOrdineScuola &&
      params.dataInizioIscrizioni &&
      params.dataScadenzaIscrizioni &&
      params.dataFineIscrizioni &&
      params.dataScadenzaGraduatoria &&
      params.dataScadenzaRicorsi) {
        
      if(
        !this.fgInserimentoAnagrafica.errors.erroreInizioFine &&
        !this.fgInserimentoAnagrafica.errors.erroreScadenzaIscrizione &&
        !this.fgInserimentoAnagrafica.errors.erroreScadenzaGraduatoria &&
        !this.fgInserimentoAnagrafica.errors.erroreScadenzaRicorsi) {
          
        this.httpClient.put<any>(
          this.config.getBEServer() + `/domande/anagrafica/graduatoria/modifica-graduatoria`,
          params
        ).subscribe(
          res => {
            alert("Operazione completata con successo")
            this.title = this.modificaString
            this.codiceGraduatoriaValidate()
          },
          err => {
            console.log("errore inserimento post", err)
            alert("Operazione fallita")
          }
        )            

      } else {
        alert("I valori evidenziati non sono coerenti")
        console.error("data scadenza ricorsi non valida rispetto alla scadenza delle iscrizioni")
      }
    } else {
      // alert("la scadenza iscrizioni non è valida rispetto a inizio e fine iscrizioni")
      alert("I valori evidenziati non sono coerenti")
      console.error("data scadenza iscrizioni non valida rispetto inizio e fine iscrizioni")
    }
  }

  private insertAnagraficaGraduatoria(): void{

    let params = new ClasseAnagraficaGraduatoria();
    params.codAnagraficaGraduatoria = this.fgInserimentoAnagrafica.value.codiceGraduatoria;
    params.codAnnoScolastico = this.annoScolastico ;
    params.codOrdineScuola = this.ordineScuola;
    params.dataInizioIscrizioni = this.fgInserimentoAnagrafica.value.dataInizioIscrizione;
    params.dataScadenzaIscrizioni = this.fgInserimentoAnagrafica.value.dataScadenzaIscrizione;
    params.dataFineIscrizioni = this.fgInserimentoAnagrafica.value.dataFineIscrizione;
    params.dataScadenzaGraduatoria = this.fgInserimentoAnagrafica.value.dataScadenzaGraduatoria;
    params.dataScadenzaRicorsi = this.fgInserimentoAnagrafica.value.dataScadenzaRicorsi;
    

    if (params.codAnagraficaGraduatoria &&
      params.codAnnoScolastico &&
      params.codOrdineScuola &&
      params.dataInizioIscrizioni &&
      params.dataScadenzaIscrizioni &&
      params.dataFineIscrizioni &&
      params.dataScadenzaGraduatoria &&
      params.dataScadenzaRicorsi) {
        
        if(!this.fgInserimentoAnagrafica.errors.erroreCodiceGraduatoria && 
          !this.fgInserimentoAnagrafica.errors.erroreInizioFine &&
          !this.fgInserimentoAnagrafica.errors.erroreScadenzaIscrizione &&
          !this.fgInserimentoAnagrafica.errors.erroreScadenzaGraduatoria &&
          !this.fgInserimentoAnagrafica.errors.erroreScadenzaRicorsi) {
            
            this.httpClient.get<any>(
              this.config.getBEServer() + `/domande/anagrafica/graduatoria/ordine-scuola/${this.ordineScuola}/codice-anagrafica/${params.codAnagraficaGraduatoria}/anno/${this.annoScolastico}`
            ).subscribe(res => {
              if (!res) {
                this.fgInserimentoAnagrafica.errors.erroreCodiceGraduatoria = false;
                this.httpClient.post<any>(
                  this.config.getBEServer() + `/domande/anagrafica/graduatoria/nuova-graduatoria`,
                  params
                ).subscribe(
                  res => {
                    alert("Operazione completata con successo")
                    this.title = this.modificaString
                    this.inserimento = true;

                    this.codiceGraduatoriaValidate()
                  },
                  err => {
                    console.log("errore inserimento post", err)
                    alert("Operazione fallita")
                  }
                )
              } else {
                this.fgInserimentoAnagrafica.errors.erroreCodiceGraduatoria = true;
              }
            }, err => console.log("errore controllo codice graduatoria", err) )        
          } else {
            alert("I valori evidenziati non sono coerenti")
            console.error("data scadenza ricorsi non valida rispetto alla scadenza delle iscrizioni")
          }
    } else {
      this.fgInserimentoAnagrafica.contains("codiceGraduatoria")
      // alert("uno o più campi sono vuoti")
      alert("I valori evidenziati non sono coerenti")
      console.error("uno o piu' campi null")
    }
  }

  codiceGraduatoriaValidate(codiceGraduatoria?: string) {
    var codGra: string
    if (codiceGraduatoria)
      codGra = codiceGraduatoria
    else
      codGra = this.fgInserimentoAnagrafica.value.codiceGraduatoria
    this.httpClient.get<any>(
      this.config.getBEServer() + `/domande/anagrafica/graduatoria/ordine-scuola/${this.ordineScuola}/codice-anagrafica/${codGra}/anno/${this.annoScolastico}`
    ).subscribe(res => {
      if (res) {
        // this.fgInserimentoAnagrafica.errors.erroreCodiceGraduatoria = true;

        const dateFormat = "yyyy-MM-dd"
        const dataInizioIscrizione = new Date(res.dataInizioIscrizioni)
        const inizioIscrizione = this.datePipe.transform(dataInizioIscrizione, dateFormat)
        const dataFineIscrizione = new Date(res.dataFineIscrizioni)
        const fineIscrizione = this.datePipe.transform(dataFineIscrizione, dateFormat)
        const dataScadenzaGraduatoria = new Date(res.dataScadenzaGraduatoria)
        const scadenzaGraduatoria = this.datePipe.transform(dataScadenzaGraduatoria, dateFormat)
        const dataScadenzaIscrizioni = new Date(res.dataScadenzaIscrizioni)
        const scadenzaIscrizioni = this.datePipe.transform(dataScadenzaIscrizioni, dateFormat)
        const dataScadenzaRicorsi = new Date(res.dataScadenzaRicorsi)
        const scadenzaRicorsi = this.datePipe.transform(dataScadenzaRicorsi, dateFormat)

        this.fgInserimentoAnagrafica.get("dataInizioIscrizione").setValue(inizioIscrizione)
        this.fgInserimentoAnagrafica.get("dataFineIscrizione").setValue(fineIscrizione)
        this.fgInserimentoAnagrafica.get("dataScadenzaGraduatoria").setValue(scadenzaGraduatoria)
        this.fgInserimentoAnagrafica.get("dataScadenzaIscrizione").setValue(scadenzaIscrizioni)
        this.fgInserimentoAnagrafica.get("dataScadenzaRicorsi").setValue(scadenzaRicorsi)
      } else {
        // this.fgInserimentoAnagrafica.errors.erroreCodiceGraduatoria = false;

        this.fgInserimentoAnagrafica.get("dataInizioIscrizione").setValue(null)
        this.fgInserimentoAnagrafica.get("dataFineIscrizione").setValue(null)
        this.fgInserimentoAnagrafica.get("dataScadenzaGraduatoria").setValue(null)
        this.fgInserimentoAnagrafica.get("dataScadenzaIscrizione").setValue(null)
        this.fgInserimentoAnagrafica.get("dataScadenzaRicorsi").setValue(null)
      }
    }, err => console.error("error occurred checking codice graduatoria", err))
  }
}

export class Errore {
  'erroreCodiceGraduatoria': boolean
  'erroreInizioFine': boolean
  'erroreScadenzaIscrizione': boolean
  'erroreScadenzaGraduatoria': boolean
  'erroreScadenzaRicorsi': boolean
}

export const inserimentoAnagraficaValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

  const codiceGraduatoria: string = control.get("codiceGraduatoria").value
  const inizio = control.get('dataInizioIscrizione');
  const fine = control.get('dataFineIscrizione');
  const scadenzaIscrizione = control.get("dataScadenzaIscrizione")
  const scadenzaGraduatoria = control.get("dataScadenzaGraduatoria")
  const scadenzaRicorsi = control.get("dataScadenzaRicorsi")
  
  var dataInizioIscrizioni = new Date(inizio.value)
  var dataFineIscrizioni = new Date(fine.value)
  var dataScadenzaIscrizioni = new Date(scadenzaIscrizione.value)
  var dataScadenzaGraduatoria = new Date(scadenzaGraduatoria.value)
  var dataScadenzaRicorsi = new Date(scadenzaRicorsi.value)

  var errore = new Errore()
  // if(control.errors)
  //   errore.erroreCodiceGraduatoria = control.errors.erroreCodiceGraduatoria
  // else 
  errore.erroreCodiceGraduatoria = false
  errore.erroreInizioFine = false
  errore.erroreScadenzaGraduatoria = false
  errore.erroreScadenzaIscrizione = false
  errore.erroreScadenzaRicorsi = false

  if(codiceGraduatoria != null &&codiceGraduatoria.length > 10) {
    errore.erroreCodiceGraduatoria = true;
  }
  if (inizio && fine && dataFineIscrizioni.getTime() < dataInizioIscrizioni.getTime()) {
    errore.erroreInizioFine = true
  }
  if (dataScadenzaIscrizioni.getTime() < dataInizioIscrizioni.getTime() || dataScadenzaIscrizioni.getTime() > dataFineIscrizioni.getTime()) {
    errore.erroreScadenzaIscrizione = true
  }
  if (dataScadenzaRicorsi.getTime() < dataScadenzaIscrizioni.getTime()) {
    errore.erroreScadenzaRicorsi = true
  }
  if (dataScadenzaGraduatoria.getTime() < dataFineIscrizioni.getTime()) {
    errore.erroreScadenzaGraduatoria = true
  }

   return errore
};
