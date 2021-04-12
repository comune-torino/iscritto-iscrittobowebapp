import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { SrvError } from 'src/app/model/common/srv-error';
import { AnnoScolastico, OrdineScuola} from 'src/app/model/gestione-classi';
import { AuthService } from 'src/app/service/auth.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';
import { Router } from '@angular/router';
import { Step } from 'src/app/model/common/Step';
import { Location } from '@angular/common';
import { DomandaService } from 'src/app/service/domanda.service';
import { AnagraficaGraduatorie } from 'src/app/model/common/AnagraficaGradautorie';
import { formatDateConverter } from 'src/app/util/dateConverter';


@Component({
  selector: 'app-selezione-scuola-anno',
  templateUrl: './selezione-scuola-anno.component.html',
  styleUrls: ['./selezione-scuola-anno.component.css']
})
export class SelezioneScuolaAnnoComponent implements OnInit {


  // caricamento pagina
  statusSearch: boolean = false;

  annoDefault
  
  // errori
  loadingError: boolean = false;
  insertError: boolean = false;
  updateError: boolean = false;
  deleteError: boolean = false;
  classePresenteError: boolean = false;
  
 
  // stati visualizzazione
  viewSeleziona: boolean = false;
 
 
  fgSelezionaScuolaAnno: FormGroup = new FormGroup({});
  

  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  ordineScolasticoList: CodiceDescrizione[] = [];
  


  constructor(
    private domandaService : DomandaService,
    private location : Location,
    private graduatoriaService: GraduatoriaService, 
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.showSeleziona();

    this.fgSelezionaScuolaAnno.addControl('annoScolastico', new FormControl(null, [Validators.required]));
    this.fgSelezionaScuolaAnno.addControl('ordine', new FormControl(null, [Validators.required]));
    this.initAnnoScolasticoList();
    this.initOrdineScolasticoList();
    
    

  }

 

  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////
  
  showSeleziona(): void {
    this.viewSeleziona = true;
  }

  //////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////
  private initAnnoScolasticoList(): void {
    this.statusSearch = true;
    this.annoScolasticoList = [];
    this.graduatoriaService.getElencoAnniScolastici().subscribe({
      next: (response: AnnoScolastico[]) => {
        if (response && response.length > 0) {
          var responseSorted = response.sort((a,b) => {
            const dataA = new Date(formatDateConverter(a.dataDa)).getTime()
            const dataB = new Date(formatDateConverter(b.dataDa)).getTime()
            return dataB - dataA
          })
          this.annoDefault = responseSorted[0].codiceAnnoScolastico

          let items: CodiceDescrizione[] = [];
          for (let item of response.reverse()) {
            const dataA = new Date(formatDateConverter(item.dataA))
            const currentDate = new Date()
            if(dataA.getTime() >= currentDate.getTime())
              items.push({
                codice: item.codiceAnnoScolastico,
                descrizione: item.codiceAnnoScolastico
            });
          }
          this.annoScolasticoList = items;
          this.selectUltimoAnno();
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      },
    });
  }

  private initOrdineScolasticoList(): void {
    //TODO this.graduatoriaService.getElencoOrdiniScolastici().subscribe()
    var response = [
      {
        "codOrdineScuola": "NID",
        "descrizione": "Nido"
      },
      {
        "codOrdineScuola": "MAT",
        "descrizione": "Scuola dell'infanzia"
      }
    ]
    for (let ordine of response) {
      if(ordine.codOrdineScuola==sessionStorage.getItem('ordineScuola')){
      this.ordineScolasticoList.push({
        codice: ordine.codOrdineScuola,
        descrizione: ordine.descrizione
      })
      this.fgSelezionaScuolaAnno.get('ordine').setValue(this.ordineScolasticoList[0]);
      }
    }
  }

  private selectUltimoAnno(): void {
    if (this.annoScolasticoList && this.annoScolasticoList.length > 0) {
      this.fgSelezionaScuolaAnno.get('annoScolastico').setValue(this.annoDefault);
    }
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

  private onClickGraduatoria(): void{
    let ordine = this.fgSelezionaScuolaAnno.value.ordine;
    let annoScolastico = this.fgSelezionaScuolaAnno.value.annoScolastico;
    var codGraduatoria: string = ""
    if(ordine != null && annoScolastico != null) { //TODO on select cod save current selected object

      //verifica che ci sia una graduatoria esistente o no
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
              if(item2.codAnnoScolastico==annoScolastico&&item2.codOrdineScuola==ordine.codice){
                codGraduatoria = item2.codAnagraficaGraduatoria;
                // codiceGraduatoria esistente => modifica
                break;
              }
            }
          }
          // this.statusSearch = false;
          this.router.navigate(['graduatorie/anagrafica/inserisci'], {queryParams:{codOrdine: ordine.codice, descOrdine: ordine.descrizione, anno:annoScolastico, codGraduatoria: codGraduatoria}});
        },
        error: (response: SrvError) => {
          // this.statusSearch = false;
          this.showLoadingError();
        }
      });
} else {
      alert("Per poter procerede, e' obbligatorio selezionare entrambe le voci");
      console.log('dati mancanti');
    }
  }

  private onClickStep(): void{
    let ordine = this.fgSelezionaScuolaAnno.value.ordine;
    let annoScolastico = this.fgSelezionaScuolaAnno.value.annoScolastico;
    if(ordine != null && annoScolastico != null) { //TODO on select cod save current selected object

           
      this.router.navigate(['graduatorie/anagrafica/step'], {queryParams:{codOrdine: ordine.codice, descOrdine: ordine.descrizione, anno:annoScolastico}});
    } else {
      alert("Per poter procerede, e' obbligatorio selezionare entrambe le voci");
      console.log('dati mancanti');
    }
  }

  private onClickEta(): void{
    let ordine = this.fgSelezionaScuolaAnno.value.ordine;
    let annoScolastico = this.fgSelezionaScuolaAnno.value.annoScolastico;
    if(ordine != null && annoScolastico != null) { //TODO on select cod save current selected object
      this.router.navigate(['graduatorie/anagrafica/eta'], {queryParams:{codOrdine: ordine.codice, descOrdine: ordine.descrizione, anno:annoScolastico}});
    } else {
      alert("Per poter procerede, e' obbligatorio selezionare entrambe le voci");
      console.log('dati mancanti');
    }
  }
}

