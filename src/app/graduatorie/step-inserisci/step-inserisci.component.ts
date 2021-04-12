
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
import { Location } from '@angular/common';

@Component({
  selector: 'app-step-inserisci',
  templateUrl: './step-inserisci.component.html',
  styleUrls: ['./step-inserisci.component.css']
})
export class StepInserisciComponent implements OnInit {

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
  viewInsStep: boolean = false;
  viewModStep: boolean = false;


  fgInserimentoStep: FormGroup = new FormGroup({});



  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  ordineScolasticoList: CodiceDescrizione[] = [];


  ordineScuola: string = "";
  ordineScuolaDescrizione: string = "";
  annoScolastico: string = "";
  codGraduatoria: string = "";




  constructor(
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

    this.showStep();



    this.ordineScuola = this.route.snapshot.queryParamMap.get('codOrdine');
    this.ordineScuolaDescrizione = this.route.snapshot.queryParamMap.get('descOrdine');
    this.annoScolastico = this.route.snapshot.queryParamMap.get('anno');
    this.codGraduatoria = this.route.snapshot.queryParamMap.get('codGraduatoria');



    this.fgInserimentoStep.addControl('ordineScuola', new FormControl(null, [Validators.required]));
    this.fgInserimentoStep.addControl('annoScolastico', new FormControl(null, [Validators.required]));
    this.fgInserimentoStep.addControl('Nstep', new FormControl(null, [Validators.required]));
    this.fgInserimentoStep.addControl('dataStep', new FormControl(null, []));
    this.fgInserimentoStep.addControl('dataDomandeDa', new FormControl(null, []));
    this.fgInserimentoStep.addControl('dataDomandeA', new FormControl(null, []));
    this.fgInserimentoStep.addControl('dataAllegati', new FormControl(null, []));

    this.fgInserimentoStep.setValidators(inserimentoStepValidator)
  }


  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////



  showStep(): void {

    this.viewInserisci = true;


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
    let Nstep: string = this.fgInserimentoStep.value.Nstep;
    if (Nstep.length <= 10) {
      // Da completare con messaggi e manca codAnagraficaGraduatoria e testare

      let params = new Step();
      // params.codAnagraficaGraduatoria = this.fgInserimentoStep.value.Nstep;
      // params.codAnnoScolastico = this.annoScolastico ;
      // params.codOrdineScuola = this.ordineScuola;
      params.dtStepGra = this.fgInserimentoStep.value.dataStep;
      params.dtDomInvDa = this.fgInserimentoStep.value.dataDomandeDa;
      params.dtDomInvA = this.fgInserimentoStep.value.dataDomandeA;
      params.dtAllegati = this.fgInserimentoStep.value.dataAllegati;
      params.codAnagraficaGraduatoria = this.codGraduatoria;
      params.codOrdineScuola = this.ordineScuola;
      params.codAnnoScolastico = this.annoScolastico;
      params.step = this.fgInserimentoStep.value.Nstep;
      // params.dataScadenzaRicorsi = this.fgInserimentoStep.value.dataScadenzaRicorsi;
      let codAnagraficaGraduatoria;




      console.log(params)

      if (



        params.dtAllegati &&
        params.dtDomInvA &&
        params.dtDomInvDa &&
        params.dtStepGra &&
        params.codAnagraficaGraduatoria &&
        params.codOrdineScuola &&
        params.step &&
        params.codAnnoScolastico
      ) {

        var errors: Errore = new Errore()
        errors.erroreAllegati = this.fgInserimentoStep.errors.erroreAllegati
        errors.erroreGraduatoria = this.fgInserimentoStep.errors.erroreGraduatoria
        errors.erroreInizioFine = this.fgInserimentoStep.errors.erroreInizioFine


        if (!errors.erroreAllegati && !errors.erroreGraduatoria && !errors.erroreInizioFine) {

          this.httpClient.post<any>(
            this.config.getBEServer() + `/domande/anagrafica/graduatoria/nuovo-step-graduatoria`,
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


}


export class Errore {
  'erroreInizioFine': boolean
  'erroreAllegati': boolean
  'erroreGraduatoria': boolean

}

export const inserimentoStepValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {

  let stepMod = new Step();

  stepMod.dtStepGra = control.value.dataStep;
  stepMod.dtDomInvDa = control.value.dataDomandeDa;
  stepMod.dtDomInvA = control.value.dataDomandeA;
  stepMod.dtAllegati = control.value.dataAllegati;

  const dtStep = new Date(stepMod.dtStepGra)
  const dtDomDa = new Date(stepMod.dtDomInvDa)
  const dtDomA = new Date(stepMod.dtDomInvA)
  const dtAll = new Date(stepMod.dtAllegati)

  var errore: Errore = new Errore()

  errore.erroreAllegati = false
  errore.erroreGraduatoria = false
  errore.erroreInizioFine = false

  if (stepMod.dtStepGra && stepMod.dtDomInvA && dtDomDa.getTime() >= dtDomA.getTime())
    errore.erroreInizioFine = true;
  if (stepMod.dtAllegati && stepMod.dtDomInvA && dtAll.getTime() < dtDomA.getTime())
    errore.erroreAllegati = true;
  if (stepMod.dtStepGra && stepMod.dtAllegati && dtStep.getTime() <= dtAll.getTime())
    errore.erroreGraduatoria = true;

  return errore
};