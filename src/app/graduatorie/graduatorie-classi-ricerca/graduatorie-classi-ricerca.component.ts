import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CodiceDescrizione } from 'src/app/model/common/codice-descrizione';
import { InfoScuola } from 'src/app/model/common/info-scuola';
import { Profilo } from 'src/app/model/common/profilo';
import { SrvError } from 'src/app/model/common/srv-error';
import { AnnoScolastico, Classe, ClasseParam } from 'src/app/model/gestione-classi';
import { InfoStepGraduatoria } from 'src/app/model/visualizza-graduatoria';
import { AuthService } from 'src/app/service/auth.service';
import { DecodificaService } from 'src/app/service/decodifica.service';
import { DomandaService } from 'src/app/service/domanda.service';
import { GraduatoriaService } from 'src/app/service/graduatoria.service';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-graduatorie-classi-ricerca',
  templateUrl: './graduatorie-classi-ricerca.component.html',
  styleUrls: ['./graduatorie-classi-ricerca.component.css']
})
export class GraduatorieClassiRicercaComponent implements OnInit {
  private readonly DEFAULT_DELETE_ERROR_MESSAGE: string =
    'Attenzione: si è verificato un errore durante la cancellazione della classe.'
  //profilo attuale
  profiloAttuale: String;
  // caricamento pagina
  statusSearch: boolean = false;

  // errori
  loadingError: boolean = false;
  insertError: boolean = false;
  updateError: boolean = false;
  deleteError: boolean = false;
  classePresenteError: boolean = false;
  ammissioniError: boolean = false;
  bloccoModificaError: boolean = false;

  // messaggio errore
  deleteErrorMessage: string = this.DEFAULT_DELETE_ERROR_MESSAGE;

  // stati visualizzazione
  viewRicerca: boolean = false;
  viewClassi: boolean = false;
  viewInsert: boolean = false;
  viewUpdate: boolean = false;
  viewDelete: boolean = false;
  viewAmmissioni: boolean = false;

  // form ricerca, modifica, inserimento, ammissioni
  fgRicercaClassi: FormGroup = new FormGroup({});
  fgInserimentoClassi: FormGroup = new FormGroup({});
  fgAmmissioni: FormGroup = new FormGroup({});

  // dati ricerca
  annoScolasticoList: CodiceDescrizione[] = [];
  nidoList: CodiceDescrizione[] = [];

  // dati modifica, inserimento, ammissioni
  fasceEtaList: CodiceDescrizione[] = [];
  tipoFrequenzaList: CodiceDescrizione[] = [];
  ammissioniList: CodiceDescrizione[] = [];

  // classi
  classi: Classe[] = [];
  classeSelezionata: Classe = null;
  bloccoModifica: boolean = false;

  constructor(
    private router: Router,
    private domandeService: DomandaService,
    private graduatoriaService: GraduatoriaService,
    private decodificaService: DecodificaService,
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.showRicerca();

    this.fgRicercaClassi.addControl('anno-scolastico', new FormControl(null, [Validators.required]));
    this.fgRicercaClassi.addControl('nido', new FormControl(null, [Validators.required]));

    this.fgInserimentoClassi.addControl('fascia-eta', new FormControl(null, [Validators.required]));
    this.fgInserimentoClassi.addControl('tipo-frequenza', new FormControl(null, [Validators.required]));
    this.fgInserimentoClassi.addControl('posti-liberi',
      new FormControl(null, [Validators.required, Validators.maxLength(3), Validators.pattern("^[0-9]*$")]));

    this.fgAmmissioni.addControl('ammissioni-problemi-sociali', new FormControl(null, [Validators.required]));

    this.initBloccoModificaStep1();
    this.initAnnoScolasticoList();
    this.initNidoList();
    this.initFasceEtaList();
    this.initFrequenzaList();
    this.initAmmissioniList();


  
  }

  //////////////////////////////////////////////////////////////////////
  // gestione form
  //////////////////////////////////////////////////////////////////////
  onSubmitRicerca() {
    this.ricercaClassi();
  }

  onSubmitInserisciClasse() {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    if (!this.checkClassePresente()) {
      this.showClassePresenteError();
      return;
    }

    const params: ClasseParam = this.buildClasseParam(false);
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');

    this.statusSearch = true;
    this.graduatoriaService.inserisciClasse(params, ordineScuola).subscribe({
      next: (response: number) => {
        this.statusSearch = false;
        this.ricercaClassi();
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showInsertError();
      },
    });
  }

  onSubmitModificaClasse() {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    const params: ClasseParam = this.buildClasseParam(true);
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');

    this.statusSearch = true;
    this.graduatoriaService.modificaClasse(params, ordineScuola).subscribe({
      next: (response: number) => {
        this.statusSearch = false;
        this.ricercaClassi();
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showUpdateError();
      },
    });
  }

  onSubmitEliminaClasse() {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    const idClasse: number = this.classeSelezionata.idClasse;

    this.statusSearch = true;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.graduatoriaService.eliminaClasse(idClasse, ordineScuola).subscribe({
      next: (response: number) => {
        this.statusSearch = false;
        this.ricercaClassi();
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        if (response.title.includes('VAL-GRA-009')) {
          this.showDeleteError(
            'Attenzione: non è possibile eliminare una classe con preferenze associate'
          );
        }
        else {
          this.showDeleteError(this.DEFAULT_DELETE_ERROR_MESSAGE);
        }
      },
    });
  }

  onSubmitModificaAmmissioni() {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    if (this.classi.length === 0) {
      this.showAmmissioniError();
      return;
    }

    const flAmmissioneDis: string = this.fgAmmissioni.controls['ammissioni-problemi-sociali'].value;
    const ammissioneDis: boolean = this.decodificaService.getBooleanFromSN(flAmmissioneDis);

    let ids: number[] = [];
    for (let classe of this.classi) {
      classe.flAmmissioneDis = flAmmissioneDis;
      ids.push(classe.idClasse);
    }

    this.statusSearch = true;
    this.graduatoriaService.aggiornaFlagAmmissioni(ids, ammissioneDis).subscribe({
      next: (response: number) => {
        this.statusSearch = false;
        this.ricercaClassi();
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showAmmissioniError();
      },
    });
  }

  //////////////////////////////////////////////////////////////////////
  // gestione stati visualizzazione
  //////////////////////////////////////////////////////////////////////
  showRicerca(): void {
    this.hideAll();
    this.viewRicerca = true;
  }

  showClassi(): void {
    this.classeSelezionata = null;

    this.hideAll();
    this.viewClassi = true;
  }

  showInsert(): void {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    this.resetFgInserimentoClassi();
    this.enableFgInserimentoClassi();

    this.hideAll();
    this.viewInsert = true;
  }

  showUpdate(): void {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    this.resetFgInserimentoClassi();
    this.setClasseSelezionata()
    this.disableFgInserimentoClassi();

    this.hideAll();
    this.viewUpdate = true;
  }

  showDelete(): void {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    this.resetFgInserimentoClassi();

    this.hideAll();
    this.viewDelete = true;
  }

  showAmmissioni(): void {
    if (this.bloccoModifica) {
      this.showBloccoModificaError();
      return;
    }

    this.resetFgAmmissioni();

    this.hideAll();
    this.viewAmmissioni = true;
  }

  hideAll(): void {
    this.viewRicerca = false;
    this.viewClassi = false;
    this.viewInsert = false;
    this.viewUpdate = false;
    this.viewDelete = false;
    this.viewAmmissioni = false;
  }

  returnSearch() {
    this.router.navigate(['/graduatorie/GRA']);
  }

  get hasPrivilegioEliminaClasse(): boolean {
    return this.profileService.hasPrivilegioEliminaClasse();
  }

  get gestioneAmmissioni(): boolean {
    return this.classi != null && this.classi.length > 0;
  }

  //////////////////////////////////////////////////////////////////////
  // decodifiche e testi
  //////////////////////////////////////////////////////////////////////
  decFasceEta(codice: string): string {
    return this.decodificaService.getDecodificaFasceEta(codice);
  }

  decTipoFrequenza(codice: string): string {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    return this.decodificaService.getDecodificaTipologiaFrequenza(codice, ordineScuola);
  }

  decSN(codice: string): string {
    return this.decodificaService.getDecodificaSN(codice);
  }

  nullToZero(value: number): number {
    return value != null ? value : 0;
  }

  get criterioRicerca(): string {
    const codScuola: string = this.fgRicercaClassi.controls['nido'].value;
    const codAnno: string = this.fgRicercaClassi.controls['anno-scolastico'].value;

    const cd: CodiceDescrizione = this.decodificaService.findByCod(codScuola, this.nidoList);
    const descScuola: string = cd ? cd.descrizione : '';


    return `anno scolastico = ${codAnno}, scuola = ${descScuola}`;
  }

  get descAmmissioni(): string {
    return this.getAmmissioni() ? 'SI' : 'NO';
  }

  //////////////////////////////////////////////////////////////////////
  // Operazioni su tabella
  //////////////////////////////////////////////////////////////////////
  onSelectionChange(classe: Classe): void {
    this.classeSelezionata = classe;
  }

  private ricercaClassi(): void {
    const codScuola: string = this.fgRicercaClassi.controls['nido'].value;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    const codAnno: string = this.fgRicercaClassi.controls['anno-scolastico'].value;

    this.statusSearch = true;
    this.graduatoriaService.getElencoClassi(codScuola, ordineScuola, codAnno).subscribe({
      next: (response: Classe[]) => {
        if (response) {
          this.classi = response;
        }
        this.statusSearch = false;
        this.showClassi();
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
      },
    });
  }

  //////////////////////////////////////////////////////////////////////
  // Utils
  //////////////////////////////////////////////////////////////////////
  private initBloccoModificaStep1(): void {
    this.bloccoModifica = false;

    this.statusSearch = true;
    /*
    this.profileService.getElencoProfili().subscribe({
      next: (response: Profilo[]) => {
        if (response && response.length > 0) {
          // TODO: adeguare la logica quando ci saranno piu' profili
          if (response[0].codice == this.profileService.CODICE_PROFILO_ECONOMA) {
            this.initBloccoModificaStep2();
          }
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.bloccoModifica = false;
        this.statusSearch = false;
      },
    });
    */

   this.profileService.getProfiloUtilizzato().subscribe({
    next: (response: Profilo) => {
      if (response) {
        this.profiloAttuale = response.codice
        if(this.profiloAttuale == this.profileService.CODICE_PROFILO_ECONOMA || this.profiloAttuale == this.profileService.CODICE_PROFILO_ECONOMA_MATERNA_COMUNALE || this.profiloAttuale == this.profileService.CODICE_PROFILO_ECONOMA_MATERNA_STATALE_E_CONVENZIONATA){
          this.initBloccoModificaStep2();
        }
      }
      this.statusSearch = false;
    },
    error: (response: SrvError) => {
      this.bloccoModifica = false;
      this.statusSearch = false;
    },
  });
  }

  private initBloccoModificaStep2(): void {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.bloccoModifica = false;

    this.statusSearch = true;
    this.graduatoriaService.getInfoStepGraduatorie(ordineScuola).subscribe({
      next: (response: InfoStepGraduatoria[]) => {
        if (response && response.length) {
          let data: InfoStepGraduatoria[] = response.filter(x => x.dtStepCon != null);
          if (data && data.length) {
            data = data.sort((x, y) => {
              let dtX = new Date(x.dtStepCon);
              let dtY = new Date(y.dtStepCon);
              return dtY.getTime() - dtX.getTime();
            });
            
            let controlloGra = data[0].flAmmissioni == 'S';
            
            if(controlloGra){
              this.bloccoModifica = data[0].codStatoGra != 'PRO';
            }

          }
        }
      },
      error: (response: SrvError) => {
        console.log('graduatoria non disponibile');
        this.bloccoModifica = false;
        this.statusSearch = false;
      },
    });
  }

  private initAnnoScolasticoList(): void {
    this.statusSearch = true;
    this.annoScolasticoList = [];
    this.graduatoriaService.getElencoAnniScolastici().subscribe({
      next: (response: AnnoScolastico[]) => {
        if (response) {
          let items: CodiceDescrizione[] = [];
          for (let item of response) {
            items.push({
              codice: item.codiceAnnoScolastico,
              descrizione: item.codiceAnnoScolastico
            });
          }
          while (items.length > 2) {
            items.shift();
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

  private initNidoList(): void {
    this.statusSearch = true;
    this.nidoList = [];
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandeService.getScuoleByUtente(ordineScuola).subscribe({
      next: (response: InfoScuola[]) => {
        if (response) {
          let items: CodiceDescrizione[] = [];
          for (let item of response) {
            items.push({
              codice: item.codScuola,
              descrizione: `${item.indirizzo} - ${item.descrizione}`
            });
          }
          this.nidoList = items;
        }
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        this.statusSearch = false;
        this.showLoadingError();
      }
    });
  }

  private initFasceEtaList(): void {

    let ordScuola = sessionStorage.getItem('ordineScuola')
    this.fasceEtaList = this.decodificaService.getElencoFasceEta(ordScuola);
  }

  private initFrequenzaList(): void {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.tipoFrequenzaList = this.decodificaService.getElencoTipologieFrquenza(ordineScuola);
  }

  private initAmmissioniList(): void {
    this.ammissioniList = this.decodificaService.getSN();
  }

  private selectUltimoAnno(): void {
    if (this.annoScolasticoList && this.annoScolasticoList.length > 0) {
      this.fgRicercaClassi.get('anno-scolastico').setValue(this.annoScolasticoList.slice(-1)[0].codice);
    }
  }

  private resetFgInserimentoClassi() {
    this.fgInserimentoClassi.controls['fascia-eta'].setValue(null);
    this.fgInserimentoClassi.controls['tipo-frequenza'].setValue(null);
    this.fgInserimentoClassi.controls['posti-liberi'].setValue(null);
  }

  private resetFgAmmissioni() {
    let ammissioni: boolean = this.getAmmissioni();
    let snValue: string = this.decodificaService.getSNFromBoolean(ammissioni);
    this.fgAmmissioni.controls['ammissioni-problemi-sociali'].setValue(snValue);
  }

  private enableFgInserimentoClassi() {
    this.fgInserimentoClassi.controls['fascia-eta'].enable();
    this.fgInserimentoClassi.controls['tipo-frequenza'].enable();
  }

  private disableFgInserimentoClassi() {
    this.fgInserimentoClassi.controls['fascia-eta'].disable();
    this.fgInserimentoClassi.controls['tipo-frequenza'].disable();
  }

  private setClasseSelezionata() {
    this.fgInserimentoClassi.controls['fascia-eta'].setValue(this.classeSelezionata.codFasciaEta);
    this.fgInserimentoClassi.controls['tipo-frequenza'].setValue(this.classeSelezionata.codTipoFrequenza);
    this.fgInserimentoClassi.controls['posti-liberi'].setValue(this.classeSelezionata.postiLiberi);
  }

  private buildClasseParam(isUpdate: boolean): ClasseParam {
    const codScuola: string = this.fgRicercaClassi.controls['nido'].value;
    const codAnno: string = this.fgRicercaClassi.controls['anno-scolastico'].value;

    const codFasciaEta: string = this.fgInserimentoClassi.controls['fascia-eta'].value;
    const codTipoFrequenza: string = this.fgInserimentoClassi.controls['tipo-frequenza'].value;
    const postiLiberi: number = this.fgInserimentoClassi.controls['posti-liberi'].value;
    const denominazione: string = codFasciaEta;
    // Anomialia id 10: modificare il valore di default nell'inserimento del campo fl_ammissione_dis a "S"
    const ammissioneDis: boolean = this.getAmmissioni();
    


    let idClasse: number;
    let postiAmmessi: number;
    if (isUpdate) {
      idClasse = this.classeSelezionata.idClasse;
      postiAmmessi = this.classeSelezionata.postiAmmessi;
    } else {
      idClasse = null;
      postiAmmessi = 0;
    }

    const params: ClasseParam = {
      "idClasse": idClasse,
      "codScuola": codScuola,
      "postiLiberi": postiLiberi,
      "postiAmmessi": postiAmmessi,
      "denominazione": denominazione,
      "codAnnoScolastico": codAnno,
      "codTipoFrequenza": codTipoFrequenza,
      "codFasciaEta": codFasciaEta,
      "ammissioneDis": ammissioneDis
    }

    return params;
  }

  private checkClassePresente(): boolean {
    const codAnno: string = this.fgRicercaClassi.controls['anno-scolastico'].value;
    const codScuola: string = this.fgRicercaClassi.controls['nido'].value;
    const codFasciaEta: string = this.fgInserimentoClassi.controls['fascia-eta'].value;
    const codTipoFrequenza: string = this.fgInserimentoClassi.controls['tipo-frequenza'].value;

    for (let classe of this.classi) {
      if (
        codAnno === classe.codAnnoScolastico &&
        codScuola === classe.codScuola &&
        codFasciaEta === classe.codFasciaEta &&
        codTipoFrequenza === classe.codTipoFrequenza
      ) {
        return false;
      }
    }

    return true;
  }

  private getAmmissioni(): boolean {
    if (this.classi && this.classi.length > 0) {
      return this.decodificaService.getBooleanFromSN(this.classi[0].flAmmissioneDis);
    }
    //modifica per anomalia 10
    return true;
  }

  private showLoadingError(): void {
    this.loadingError = true;
    setTimeout(() => {
      this.loadingError = false;
    }, 9000);
  }

  private showInsertError(): void {
    this.insertError = true;
    setTimeout(() => {
      this.insertError = false;
    }, 9000);
  }

  private showUpdateError(): void {
    this.updateError = true;
    setTimeout(() => {
      this.updateError = false;
    }, 9000);
  }

  private showDeleteError(message: string): void {
    this.deleteErrorMessage = message;
    this.deleteError = true;
    setTimeout(() => {
      this.deleteError = false;
    }, 9000);
  }

  private showClassePresenteError(): void {
    this.classePresenteError = true;
    setTimeout(() => {
      this.classePresenteError = false;
    }, 9000);
  }

  private showAmmissioniError(): void {
    this.ammissioniError = true;
    setTimeout(() => {
      this.ammissioniError = false;
    }, 9000);
  }

  private showBloccoModificaError(): void {
    this.bloccoModificaError = true;
    setTimeout(() => {
      this.bloccoModificaError = false;
    }, 9000);
  }

  get isNido(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'NID';
  }
 

  

}
