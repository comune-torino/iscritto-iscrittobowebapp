
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { SrvError } from 'src/app/model/common/srv-error';
import { AnnoScolastico, OrdineScuola } from 'src/app/model/gestione-classi';
import { AuthService } from 'src/app/service/auth.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/service/config.service';
import { HttpClient } from '@angular/common/http';
import { Step } from 'src/app/model/common/Step';
import { DomandaService } from 'src/app/service/domanda.service';
import { DatePipe, Location } from '@angular/common';
import { AnagraficaGraduatorie } from 'src/app/model/common/AnagraficaGradautorie';


@Component({
  selector: 'app-step-anagrafica',
  templateUrl: './step-anagrafica.component.html',
  styleUrls: ['./step-anagrafica.component.css']
})
export class StepAnagraficaComponent implements OnInit {

  // caricamento pagina
  statusSearch: boolean = false;

  // errori
  loadingError: boolean = false;
  insertError: boolean = false;
  updateError: boolean = false;
  deleteError: boolean = false;
  classePresenteError: boolean = false;


  // stati visualizzazione
  viewStep: boolean = false;
  viewButton: boolean = false;

  codGraduatoriaPresente: boolean = false;

  fgStepAnagrafica: FormGroup = new FormGroup({});

  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  ordineScolasticoList: CodiceDescrizione[] = [];
  stepAnagraficaList: Step[] = [];

  st: Step[] = [];
  st2: AnagraficaGraduatorie[] =[];

  ordineScuola: string = "";
  ordineScuolaDescrizione: string = "";
  annoScolastico: string = "";
  codGraduatoria: string = "";
  idStepGra : string = "";

  step: string = "";
  dataStep: string = "";
  dataDomDa: string = "";
  dataDomA: string = "";
  dataAll: string = "";

  selected: Step;

  selectedRow : Number;
  
  constructor(
    private domandaService: DomandaService,
    private datePipe: DatePipe,
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

    this.statusSearch = true;

    this.fgStepAnagrafica.addControl('ordineScuola', new FormControl(null, [Validators.required]));
    this.fgStepAnagrafica.addControl('annoScolastico', new FormControl(null, [Validators.required]));
    this.fgStepAnagrafica.addControl('codGraduatoria', new FormControl(null, [Validators.required]));

    this.domandaService.getAnagraficaGraduatoria().subscribe({
      next: (res: AnagraficaGraduatorie[]) => {
        if (res) {
          let items2: AnagraficaGraduatorie[] = [];
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
            if(item2.codAnnoScolastico==this.annoScolastico&&item2.codOrdineScuola==this.ordineScuola){
              this.codGraduatoria = item2.codAnagraficaGraduatoria;
              this.codGraduatoriaPresente = true;
              this.initAnagraficaList();
              break;
            }
          }
          this.st2 = items2;
          if(!this.codGraduatoriaPresente){
            alert("Anagrafica graduatoria non presente")
            
          }
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      }
    });

   



    // console.log(this.codGraduatoria)
  }

  private initAnagraficaList(): void {
    // this.stepAnagraficaList = this.

    this.initStepList();

  }



  private initStepList(): void {
    this.statusSearch = true;

    this.domandaService.getElencoAnagraficaStepGraduatoria(this.ordineScuola, this.codGraduatoria, this.annoScolastico).subscribe({
      next: (response: Step[]) => {



        if (response) {
          let items: Step[] = [];
          for (let item of response) {
            items.push({
              step: item.step,
              idStepGra : item.idStepGra,
              dtStepGra: new Date(item.dtStepGra).toLocaleDateString(),
              dtDomInvDa: new Date(item.dtDomInvDa).toLocaleDateString(),
              dtDomInvA: new Date(item.dtDomInvA).toLocaleDateString(),
              dtAllegati: new Date(item.dtAllegati).toLocaleDateString(),
              codAnagraficaGraduatoria : "",
              codOrdineScuola : "",
              codAnnoScolastico : ""
            });
          }
          this.st = items.sort((x,y) => {
            return +x.step - +y.step;
          });
          // if(this.st.length==0){alert("Anagrafica graduatoria non presente")}

        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      }
    });

   

  }




  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////

  showStep(): void {

    this.viewStep = true;
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

  inserisciStep() {


    console.log(this.ordineScuola);

    this.router.navigate(['graduatorie/anagrafica/step/inserisci'], { queryParams: { codOrdine: this.ordineScuola, descOrdine: this.ordineScuolaDescrizione, anno: this.annoScolastico, codGraduatoria: this.codGraduatoria } });

  }

  modificaStep() {

    console.log(this.selected);

    

    this.router.navigate(['graduatorie/anagrafica/step/modifica'],
      {
        queryParams: {
          codOrdine: this.ordineScuola,
          descOrdine: this.ordineScuolaDescrizione,
          codGraduatoria : this.codGraduatoria,
          idStepGra : this.selected.idStepGra,
          anno: this.annoScolastico,
          step: this.selected.step,
          dataStep: this.formatDateConverter(this.selected.dtStepGra),
          dataDomDa: this.formatDateConverter(this.selected.dtDomInvDa),
          dataDomA: this.formatDateConverter(this.selected.dtDomInvA),
          dataAllegato: this.formatDateConverter(this.selected.dtAllegati) 
        
        }
      }
    );
  }

  formatDateConverter(date: string): string {
      var splited = date.split('/')
      if(splited[0].length==1) splited[0] = "0"+splited[0];
      if(splited[1].length==1) splited[1] = "0"+splited[1];
      return `${splited[2]}-${splited[1]}-${splited[0]}`
  }

 

  select(s,i){
    this.selected = s;
    this.selectedRow = i;


  }
  

  eliminaStep() {
      this.domandaService.getEliminaStep(+this.selected.idStepGra).subscribe( res => {
        console.log(`${res} deleted`); 
        alert("Operazione completata con successo");         
        this.initStepList()
    },
      err => {
        if (err.code = "VAL-GRA-010") {
          alert("Operazione non consentita : lo step è già stato eseguito")
        } else 
        console.log("errore inserimento post", err)
      })       
  }






}



