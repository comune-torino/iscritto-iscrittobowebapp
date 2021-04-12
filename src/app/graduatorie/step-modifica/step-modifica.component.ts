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
import { Step } from 'src/app/model/common/Step';
import { DatePipe, Location } from '@angular/common';
import { st } from '@angular/core/src/render3';



@Component({
  selector: 'app-step-modifica',
  templateUrl: './step-modifica.component.html',
  styleUrls: ['./step-modifica.component.css']
})
export class StepModificaComponent implements OnInit {


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


  fgModificaStep: FormGroup = new FormGroup({});


  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  ordineScolasticoList: CodiceDescrizione[] = [];
  stepAnagraficaList: Step[] = [];

  ordineScuola: string = "";
  ordineScuolaDescrizione: string = "";
  annoScolastico: string = "";
  codGraduatoria: string = "";
  idStepGra: string = "";

  step: string = "";
  dataStep: string = "";
  dataDomDa: string = "";
  dataDomA: string = "";
  dataAll: string = "";

  modifica: boolean = false;


  selected: Step;



  constructor(
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

    this.showStep();



    this.ordineScuola = this.route.snapshot.queryParamMap.get('codOrdine');
    this.ordineScuolaDescrizione = this.route.snapshot.queryParamMap.get('descOrdine');
    this.annoScolastico = this.route.snapshot.queryParamMap.get('anno');
    this.codGraduatoria = this.route.snapshot.queryParamMap.get('codGraduatoria');


    this.step = this.route.snapshot.queryParamMap.get('step');
    this.dataStep = this.route.snapshot.queryParamMap.get('dataStep');
    this.dataDomDa = this.route.snapshot.queryParamMap.get('dataDomDa');
    this.dataDomA = this.route.snapshot.queryParamMap.get('dataDomA');
    this.dataAll = this.route.snapshot.queryParamMap.get('dataAllegato');
    this.idStepGra = this.route.snapshot.queryParamMap.get('idStepGra');


    this.fgModificaStep.addControl('ordineScuola', new FormControl(null, [Validators.required]));
    this.fgModificaStep.addControl('annoScolastico', new FormControl(null, [Validators.required]));
    this.fgModificaStep.addControl('codGraduatoria', new FormControl(null, [Validators.required]));
    this.fgModificaStep.addControl('Nstep', new FormControl(this.step, [Validators.required]));
    this.fgModificaStep.addControl('dataStep', new FormControl(this.dataStep, []));
    this.fgModificaStep.addControl('dataDomandeDa', new FormControl(this.dataDomDa, []));
    this.fgModificaStep.addControl('dataDomandeA', new FormControl(this.dataDomA, []));
    this.fgModificaStep.addControl('dataAllegati', new FormControl(this.dataAll, []));

   


    this.fgModificaStep.setValidators(modificaStepValidator)

    this.statusSearch = false;


  }





  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////

  showStep(): void {

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


  modificaStep() {

    console.log(this.selected);
    let Nstep: string = this.fgModificaStep.value.Nstep;
    if (Nstep.length <= 10) {
      // Da completare con messaggi e manca codAnagraficaGraduatoria e testare

      let params = new Step();
      params.dtStepGra = this.fgModificaStep.value.dataStep;
      params.dtDomInvDa = this.fgModificaStep.value.dataDomandeDa;
      params.dtDomInvA = this.fgModificaStep.value.dataDomandeA;
      params.dtAllegati = this.fgModificaStep.value.dataAllegati;
      params.codAnagraficaGraduatoria = this.codGraduatoria;
      params.codOrdineScuola = this.ordineScuola;
      params.codAnnoScolastico = this.annoScolastico;
      params.step = this.fgModificaStep.value.Nstep;
      params.idStepGra = this.idStepGra;


    


      if (params.dtAllegati &&
        params.dtAllegati &&
        params.dtDomInvA &&
        params.dtDomInvDa &&
        params.dtStepGra &&
        params.codAnagraficaGraduatoria &&
        params.codOrdineScuola &&
        params.step &&
        params.codAnnoScolastico
      ) {
        // dataDomandaDa deve essere inferiore a dataDomandaA
        
        var errors: Errore = new Errore()
        errors.erroreAllegati = this.fgModificaStep.errors.erroreAllegati
        errors.erroreGraduatoria = this.fgModificaStep.errors.erroreGraduatoria
        errors.erroreInizioFine = this.fgModificaStep.errors.erroreInizioFine

        
        if (!errors.erroreAllegati && !errors.erroreGraduatoria && !errors.erroreInizioFine) {

          this.httpClient.put<any>(
            this.config.getBEServer() + `/domande/anagrafica/graduatoria/modifica-step-graduatoria`,
            params
          ).subscribe(
            res => {
              alert('Operazione completata con successo')
              this.location.back();
            },
            err => {
              if (err.code = "VAL-GRA-010") {
                alert("Operazione non consentita : lo step è già stato eseguito")
              } else 
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
}




export class Errore {
  'erroreInizioFine': boolean
  'erroreAllegati' : boolean
  'erroreGraduatoria' : boolean

}

export const modificaStepValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

  let stepMod = new Step();

  stepMod.dtStepGra =control.value.dataStep;
  stepMod.dtDomInvDa = control.value.dataDomandeDa;
  stepMod.dtDomInvA = control.value.dataDomandeA;
  stepMod.dtAllegati =control.value.dataAllegati;

  const dtStep = new Date(stepMod.dtStepGra)
  const dtDomDa = new Date(stepMod.dtDomInvDa)
  const dtDomA = new Date(stepMod.dtDomInvA)
  const dtAll = new Date(stepMod.dtAllegati)

  var errore: Errore = new Errore()

  errore.erroreAllegati=false
  errore.erroreGraduatoria=false
  errore.erroreInizioFine=false

  if(stepMod.dtStepGra && stepMod.dtDomInvA && dtDomDa.getTime() >= dtDomA.getTime())
    errore.erroreInizioFine = true;
  if(stepMod.dtAllegati && stepMod.dtDomInvA && dtAll.getTime() < dtDomA.getTime())
    errore.erroreAllegati = true;
  if(stepMod.dtStepGra && stepMod.dtAllegati && dtStep.getTime() <= dtAll.getTime())
    errore.erroreGraduatoria =true;
  
    return errore
};

