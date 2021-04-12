import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { SrvError } from 'src/app/model/common/srv-error';
import { AnnoScolastico, OrdineScuola } from 'src/app/model/gestione-classi';
import { AuthService } from 'src/app/service/auth.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/service/config.service';
import { HttpClient } from '@angular/common/http';
import { Eta } from 'src/app/model/common/Eta';
import { DatePipe, Location } from '@angular/common';
import { st } from '@angular/core/src/render3';
import { DomandaService } from 'src/app/service/domanda.service';
import { FasceEta } from 'src/app/model/common/FasceEta';

@Component({
  selector: 'app-eta-modifica',
  templateUrl: './eta-modifica.component.html',
  styleUrls: ['./eta-modifica.component.css']
})
export class EtaModificaComponent implements OnInit {

  

  // caricamento pagina
  statusSearch: boolean = false;

  // errori
  loadingError: boolean = false;
  insertError: boolean = false;
  updateError: boolean = false;
  deleteError: boolean = false;
  classePresenteError: boolean = false;


  // stati visualizzazione
  viewModifica: boolean = false;


  fgModificaEta: FormGroup = new FormGroup({});


  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  ordineScolasticoList: CodiceDescrizione[] = [];
  etaAnagraficaList: Eta[] = [];
  etaList: CodiceDescrizione[] = [];
  fasceEtaList: FasceEta[] = [];
  

  ordineScuola: string = "";
  ordineScuolaDescrizione: string = "";
  annoScolastico: string = "";
  codGraduatoria: string = "";
  idEta : string = "";
  descFasciaEta: string = "";

  codFasciaEta : string = "";
  dataA : string = "";
  dataDa : string = "";
  status : string = "";

  selected: Eta;
  et: Eta[];

  constructor(
    private domandaService: DomandaService,
    private location: Location,
    private datePipe: DatePipe,
    private httpClient: HttpClient,
    private config: ConfigService,
    private route: ActivatedRoute,
    private graduatoriaService: GraduatoriaService,
    private authService: AuthService,
    private router: Router
  ) { }







  ngOnInit() {

    this.authService.checkOperatoreAbilitato();

    this.showEta();



    this.ordineScuola = this.route.snapshot.queryParamMap.get('codOrdine');
    this.ordineScuolaDescrizione = this.route.snapshot.queryParamMap.get('descOrdine');
    this.annoScolastico = this.route.snapshot.queryParamMap.get('anno');
    this.codGraduatoria = this.route.snapshot.queryParamMap.get('codGraduatoria');
    this.idEta = this.route.snapshot.queryParamMap.get('idEta');

  
    this.initEtaList();


    this.codFasciaEta = this.route.snapshot.queryParamMap.get('codFasciaEta');
    this.dataDa = this.route.snapshot.queryParamMap.get('dataDa');
    this.dataA = this.route.snapshot.queryParamMap.get('dataA');

    this.status = this.codFasciaEta;
    
    console.log(this.status)

    this.fgModificaEta.addControl('ordineScuola', new FormControl(null, [Validators.required]));
    this.fgModificaEta.addControl('annoScolastico', new FormControl(null, [Validators.required]));
    this.fgModificaEta.addControl('codGraduatoria', new FormControl(null, [Validators.required]));
    this.fgModificaEta.addControl('codFasciaEta', new FormControl(this.codFasciaEta, []));
    this.fgModificaEta.addControl('dataDa', new FormControl(this.dataDa, []));
    this.fgModificaEta.addControl('dataA', new FormControl(this.dataA, []));
    this.fgModificaEta.addControl('codFasciaEta', new FormControl(this.status, []));



    this.fgModificaEta.setValidators(modificaEtaValidator)

    this.statusSearch = false;


  }


  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////

  showEta(): void {
    this.viewModifica = true;
  }

  private showLoadingError(): void {
    this.loadingError = true;
    setTimeout(() => {
      this.loadingError = false;
    }, 9000);
  }

  returnSearch() {
    this.location.back();
  }

  private initEtaList(){

    this.statusSearch = true;

    this.domandaService.getElencoAnagraficaEta(this.ordineScuola, this.codGraduatoria, this.annoScolastico).subscribe({
      next: (response: Eta[]) => {
        if (response) {
          let items: Eta[] = [];
          for (let item of response) {
            items.push({
              codFasciaEta: item.codFasciaEta,  
              dataA: new Date(item.dataA).toLocaleDateString(),
              dataDa: new Date(item.dataDa).toLocaleDateString(),
              idEta: item.idEta,
              codAnagraficaGraduatoria : item.codAnagraficaGraduatoria,
              codOrdineScuola : item.codOrdineScuola,
              codAnnoScolastico : item.codAnnoScolastico
            });
          }
          this.et = items;

        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      }
    });

    this.initDescEtaList(this.ordineScuola);

   
   

  }

  private initDescEtaList(ordineScuola: string): void {
    this.statusSearch = true;
    this.fasceEtaList = [];
    this.domandaService.getTipiFasceEta().subscribe(
      (response: FasceEta[]) => {
        if (response) {
          let items: FasceEta[] = [];
          for (let item of response){
            items.push({
              codFasciaEta: item.codFasciaEta,
              descFasciaEta: item.descFasciaEta,
              codOrdineScuola: item.codOrdineScuola
            });
          }
          
          this.fasceEtaList = items.filter(x => {
            return x.codOrdineScuola  == ordineScuola});
          
        }
        this.statusSearch = false;
      },
      (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      },
    );
  }
  
  
  getEtaDesc(cod: string): string{
    return this.etaList.filter(x=> x.codice == cod)[0].descrizione
   }
    
  modificaEta() {

    console.log(this.selected);
 
      // Da completare con messaggi e manca codAnagraficaGraduatoria e testare

      let params = new Eta();
     
      params.codAnagraficaGraduatoria = this.codGraduatoria;
      params.codOrdineScuola = this.ordineScuola;
      params.codAnnoScolastico = this.annoScolastico;
      params.codFasciaEta = this.fgModificaEta.value.codFasciaEta;
      params.idEta = this.idEta;
      params.dataDa = this.fgModificaEta.value.dataDa;
      params.dataA = this.fgModificaEta.value.dataA;



      if (params.dataA &&
        params.idEta &&
        params.codAnagraficaGraduatoria &&
        params.codOrdineScuola &&
        params.codFasciaEta &&
        params.dataDa &&
        params.dataA
      ) {
        // dataDomandaDa deve essere inferiore a dataDomandaA
        
        var errors: Errore = new Errore()
        errors.erroreInizioFine = this.fgModificaEta.errors.erroreInizioFine

        
        if (!errors.erroreInizioFine) {

          this.httpClient.put<any>(
            this.config.getBEServer() + `/domande/anagrafica/eta/modifica-anagrafica-eta`,
            params
          ).subscribe(
            res => {
              alert('Operazione completata con successo')
              this.location.back();
            },
            err => {
              console.log("errore inserimento post", err)
            }
          )
        } else {
          alert('I valori evidenziati non sono coerenti')
        }
      } else {
        alert('I valori evidenziati non sono coerenti')
      }
  }
}




export class Errore {
  'erroreInizioFine': boolean
  'erroreAllegati' : boolean
  'erroreGraduatoria' : boolean

}

export const modificaEtaValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

  let etaMod = new Eta();

  etaMod.dataDa =control.value.dataDa;
  etaMod.dataA = control.value.dataA;
  

  const dataDa = new Date(etaMod.dataDa)
  const dataA = new Date(etaMod.dataA)


  var errore: Errore = new Errore()

  errore.erroreInizioFine=false

  if (dataDa.getTime() > dataA.getTime())
  errore.erroreInizioFine = true; 

  return errore

};
