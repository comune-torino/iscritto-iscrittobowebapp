
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { SrvError } from 'src/app/model/common/srv-error';
import { AuthService } from 'src/app/service/auth.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/service/config.service';
import { HttpClient } from '@angular/common/http';
import { Eta } from 'src/app/model/common/Eta';
import { Location } from '@angular/common';
import { DomandaService } from 'src/app/service/domanda.service';
import { FasceEta } from 'src/app/model/common/FasceEta';

@Component({
  selector: 'app-eta-inserisci',
  templateUrl: './eta-inserisci.component.html',
  styleUrls: ['./eta-inserisci.component.css']
})
export class EtaInserisciComponent implements OnInit {

  // caricamento pagina
  statusSearch: boolean = false;

  // errori
  loadingError: boolean = false;
  insertError: boolean = false;
  updateError: boolean = false;
  deleteError: boolean = false;
  classePresenteError: boolean = false;


  // stati visualizzazione
  viewInserisci: boolean = false;
  viewInsEta: boolean = false;
  viewModEta: boolean = false;


  fgInserimentoEta: FormGroup = new FormGroup({});



  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  ordineScolasticoList: CodiceDescrizione[] = [];
  fasceEtaList: FasceEta[] = [];


  ordineScuola: string = "";
  ordineScuolaDescrizione: string = "";
  annoScolastico: string = "";
  codGraduatoria: string = "";




  constructor(
    private domandaService: DomandaService,
   
    private location: Location,
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

    this.fgInserimentoEta.addControl('ordineScuola', new FormControl(null, [Validators.required]));
    this.fgInserimentoEta.addControl('annoScolastico', new FormControl(null, [Validators.required]));
    this.fgInserimentoEta.addControl('idEta', new FormControl(null, [Validators.required]));
    this.fgInserimentoEta.addControl('codFasciaEta', new FormControl(null, []));
    this.fgInserimentoEta.addControl('dataDa', new FormControl(null, []));
    this.fgInserimentoEta.addControl('dataA', new FormControl(null, []));
    this.fgInserimentoEta.addControl('codFasciaEta', new FormControl(null, []));

    this.fgInserimentoEta.setValidators(inserimentoEtaValidator)


    this.initEtaList(this.ordineScuola)

  }


  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////



  showEta(): void {
    this.viewInserisci = true;
  }
 
  private initEtaList(ordineScuola: string): void {
    this.statusSearch = true;
    this.fasceEtaList = [];
    this.domandaService.getTipiFasceEta().subscribe({
      next: (response: FasceEta[]) => {
        if (response) {
          let items: FasceEta[] = [];
          for (let item of response) {
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
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      },
    });
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




  onClickInserisci(): void {
    
      // Da completare con messaggi e manca codAnagraficaGraduatoria e testare

      let params = new Eta();
      // params.codAnagraficaGraduatoria = this.fgInserimentoStep.value.Nstep;
      // params.codAnnoScolastico = this.annoScolastico ;
      // params.codOrdineScuola = this.ordineScuola;
      params.idEta = this.fgInserimentoEta.value.idEta;
      params.dataDa = this.fgInserimentoEta.value.dataDa;
      params.dataA = this.fgInserimentoEta.value.dataA;
      params.codAnagraficaGraduatoria = this.codGraduatoria;
      params.codOrdineScuola = this.ordineScuola;
      params.codAnnoScolastico = this.annoScolastico;
      params.codFasciaEta = this.fgInserimentoEta.value.codFasciaEta;
      // params.dataScadenzaRicorsi = this.fgInserimentoStep.value.dataScadenzaRicorsi;
      let codAnagraficaGraduatoria;


     

      console.log(params)

      if (params.dataA &&
        params.codAnagraficaGraduatoria &&
        params.codOrdineScuola &&
        params.codFasciaEta &&
        params.dataDa 
        
        
      ) {

        var errors: Errore = new Errore()
        errors.erroreInizioFine = this.fgInserimentoEta.errors.erroreInizioFine


        if (!errors.erroreInizioFine) {

          this.httpClient.post<any>(
            this.config.getBEServer() + `/domande/anagrafica/eta/nuova-anagrafica-eta`,
            params
          ).subscribe(
            res => {
              alert("Operazione completata con successo")
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
  
}

export const inserimentoEtaValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

  let stepEta = new Eta();

  stepEta.dataDa = control.value.dataDa;
  stepEta.dataA = control.value.dataA;

  const dataDa = new Date(stepEta.dataDa)
  const dataA = new Date(stepEta.dataA)
  
  var errore: Errore = new Errore()

  
  errore.erroreInizioFine = false


  if (dataDa.getTime() > dataA.getTime())
    errore.erroreInizioFine = true; 

  return errore
};
