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
import { DomandaService } from 'src/app/service/domanda.service';
import { DatePipe, Location } from '@angular/common';
import { AnagraficaGraduatorie } from 'src/app/model/common/AnagraficaGradautorie';
import { Eta } from 'src/app/model/common/Eta'; 
import { FasceEta } from 'src/app/model/common/FasceEta';

@Component({
  selector: 'app-eta-anagrafica',
  templateUrl: './eta-anagrafica.component.html',
  styleUrls: ['./eta-anagrafica.component.css']
})
export class EtaAnagraficaComponent implements OnInit {

  // caricamento pagina
  statusSearch: boolean = false;

  // errori
  loadingError: boolean = false;
  insertError: boolean = false;
  updateError: boolean = false;
  deleteError: boolean = false;
  classePresenteError: boolean = false;


  // stati visualizzazione
  viewEta: boolean = false;
  viewButton: boolean = false;

  fgEtaAnagrafica: FormGroup = new FormGroup({});

  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  ordineScolasticoList: CodiceDescrizione[] = [];
  etaAnagraficaList: Eta[] = [];

  et: Eta[] = [];
  etaList: CodiceDescrizione[] = [];

  st2: AnagraficaGraduatorie[] =[];

  ordineScuola: string = "";
  ordineScuolaDescrizione: string = "";
  annoScolastico: string = "";
  codGraduatoria: string = "";
  idEta : string = "";

  codFasciaEta : string = "";
  dataA : string = "";
  dataDa : string = "";

  selected: Eta;
  selFasciaEta: FasceEta;

  selectedRow : Number;

  anagraficaGrad : AnagraficaGraduatorie []= [];

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
    
    this.showEta();

    this.ordineScuola = this.route.snapshot.queryParamMap.get('codOrdine');
    this.ordineScuolaDescrizione = this.route.snapshot.queryParamMap.get('descOrdine');
    this.annoScolastico = this.route.snapshot.queryParamMap.get('anno');

    this.statusSearch = true;

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
              this.initAnagraficaList();
            }
          }

          this.anagraficaGrad = items2;
      
          if (this.codGraduatoria==""){
            alert("Non esiste un'anagrafica graduatoria con questi parametri")
            this.location.back();
          }
        }
       
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      }
    });



    this.fgEtaAnagrafica.addControl('ordineScuola', new FormControl(null, [Validators.required]));
    this.fgEtaAnagrafica.addControl('annoScolastico', new FormControl(null, [Validators.required]));
    this.fgEtaAnagrafica.addControl('codGraduatoria', new FormControl(this.codGraduatoria, [Validators.required]));

    console.log(this.codGraduatoria)
  }

  private initAnagraficaList(): void {
    this.initEtaList();
    this.initDescEta();
  }



  private initEtaList(): void {

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
  }

  

  private initDescEta(){

    var response = [
      {
        "codice": "G",
        "descrizione": "grandi"
      },
      {
        "codice": "P",
        "descrizione": "piccoli"
      },
      {
        "codice": "L",
        "descrizione": "lattanti"
      },
      {
        "codice": "I",
        "descrizione": "Primo anno"
      },
      {
        "codice": "II",
        "descrizione": "Secondo anno"
      },
      {
        "codice": "III",
        "descrizione": "Terzo anno"
      },
      {
        "codice": "OM",
        "descrizione": "Classe omogenea"
      }
    ]
    for (let x of response) {
        this.etaList.push({
          codice: x.codice,
          descrizione: x.descrizione
        })
    }

  }
  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////

  showEta(): void {
    this.viewEta = true;
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



  inserisciEta() {
    this.router.navigate(['graduatorie/anagrafica/eta/inserisci'], { queryParams: { codOrdine: this.ordineScuola, descOrdine: this.ordineScuolaDescrizione, anno: this.annoScolastico, codGraduatoria: this.codGraduatoria } });
  }

  modificaEta() {
    
    
  this.router.navigate(['graduatorie/anagrafica/eta/modifica'],
      {
        queryParams: {
          codOrdine: this.ordineScuola,
          descOrdine: this.ordineScuolaDescrizione,
          codGraduatoria : this.codGraduatoria,
          idEta : this.selected.idEta,
          anno: this.annoScolastico,
          codFasciaEta : this.selected.codFasciaEta,
          dataDa: this.formatDateConverter(this.selected.dataDa),
          dataA: this.formatDateConverter(this.selected.dataA)

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

    console.log(s.idEta)
    this.selected = s;
    this.selectedRow = i;
  }
  

  eliminaEta() {
    const dataInizioString = this.anagraficaGrad.filter(x => x.codAnagraficaGraduatoria == this.selected.codAnagraficaGraduatoria
    )[0].dataInizioIscrizioni
    const dataInizio = new Date(dataInizioString)
    
    if (new Date().getTime() > dataInizio.getTime()) {
      alert("Operazione non consentita: è già iniziata la raccolta delle domande")
    }else{

      this.domandaService.getEliminaEta(+this.selected.idEta).subscribe( 
        res => {console.log(`${res} deleted`); alert("Operazione completata con successo")},
        err => {console.error(err)}
        )   
      this.ngOnInit(); 
    }
  }

 getEtaDesc(cod: string): string{
  try{
    return this.etaList.filter(x=> x.codice == cod)[0].descrizione
  }catch(error){
    console.log("Codice not found:" + cod)
  } 
 }
  

}

