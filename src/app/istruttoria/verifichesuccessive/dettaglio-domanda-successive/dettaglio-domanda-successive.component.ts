import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Allegato } from '../../../model/common/Allegato';
import { CodiceDescrizioneIstruttoria } from '../../../model/common/CodiceDescrizioneIstruttoria';
import { FunzioneSocioSanitariaPost } from '../../../model/common/FunzioneSocioSanitariaPost';
import { FunzioneVariazionePost } from '../../../model/common/FunzioneVariazionePost';
import { SrvError } from '../../../model/common/srv-error';
import { StoricoVariazione } from '../../../model/common/StoricoVariazione';
import { UserInfo } from '../../../model/common/user-info';
import { DecodificaService } from '../../../service/decodifica.service';
import { IstruttoriaService } from '../../../service/istruttoria.service';
import { LoginService } from '../../../service/login.service';

@Component({
  selector: 'app-dettaglio-domanda-successive',
  templateUrl: './dettaglio-domanda-successive.component.html',
  styleUrls: ['./dettaglio-domanda-successive.component.css']
})
export class DettaglioDomandaSuccessiveComponent implements OnInit {
  globalError: boolean = false;
  validationError: boolean = false;
  validationMessage: string = null;

  idDomanda: string;
  codTipoIstruttoria: string;
  maxFunzioneVariazione: number;
  actualFunzioneVariazione: number;
  motivazioneFunzioneVariazione = '';
  radioSelect = '';
  motivazioneSelect = '';
  radioSelectedSocSan = '';
  motivazioneSelectSocSan = '';
  verifiche: CodiceDescrizioneIstruttoria[];
  storicoVariazione: StoricoVariazione[];
  certificati: Allegato[];
  radioFormFunzioneVariazione = new FormGroup({});
  radioFormFunzioneVariazioneSocSan = new FormGroup({});
  codiceCondizionePunteggio: string;
  loadStorico = false;

  constructor(
    private router: Router, private route: ActivatedRoute,
    private istruttoriaService: IstruttoriaService,
    private decodificaService: DecodificaService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.radioFormFunzioneVariazioneSocSan.addControl('valPunPrio', new FormControl('',
      [Validators.required]));
    this.radioFormFunzioneVariazioneSocSan.addControl('valPun', new FormControl('',
      [Validators.required]));
    this.radioFormFunzioneVariazioneSocSan.addControl('rifSocSan', new FormControl('',
      [Validators.required]));
    this.radioFormFunzioneVariazioneSocSan.addControl('rifRedCon', new FormControl('',
      [Validators.required]));
    this.radioFormFunzioneVariazioneSocSan.addControl('rifRicInt', new FormControl('',
      [Validators.required]));
    this.radioFormFunzioneVariazioneSocSan.addControl('motivazioneSocSan', new FormControl('',
      [Validators.required, Validators.minLength(1), Validators.maxLength(500)]));
    this.route.params.subscribe(params => {
      this.idDomanda = params['id'];
    });
    this.route.params.subscribe(params => {
      this.codTipoIstruttoria = params['codTipoIstruttoria'];
    });
    this.route.params.subscribe(params => {
      this.codiceCondizionePunteggio = params['codiceCondizionePunteggio'];
    });
    this.getVerifichePreventive();
    this.getStoricoVariazioni(this.idDomanda, this.codiceCondizionePunteggio);
    if (this.codTipoIstruttoria === 'COM' || this.codTipoIstruttoria === 'COM_A' || this.codTipoIstruttoria === 'BIN_A') {
      this.getCertificati();
    }
  }

  changeFunzioneVarietaSocSan(criterio: string) {
    this.radioSelectedSocSan = criterio;
  }

  changeFunzioneVarieta(criterio: string) {
    this.radioSelect = criterio;
  }

  get disabledButtonConfirm() {
    if (this.radioFormFunzioneVariazione && this.maxFunzioneVariazione === 1) {
      if (this.radioFormFunzioneVariazione.get('valida') !== null && this.radioSelect === 'VAL') {
        return this.radioFormFunzioneVariazione.get('valida').invalid;
      } else if (this.radioFormFunzioneVariazione.get('motivazione') !== null && this.radioSelect === 'RIF') {
        return this.radioFormFunzioneVariazione.get('motivazione').invalid;
      } else {
        return true;
      }
    } else if (this.maxFunzioneVariazione > 1) {
      if (this.countVariazioneRicorrenza > this.maxFunzioneVariazione) {
        return true;
      } else if (this.countVariazioneRicorrenza === this.maxFunzioneVariazione) {
        return false;
      } else if (this.radioFormFunzioneVariazione.get('motivazione') !== null
        && this.countVariazioneRicorrenza < this.maxFunzioneVariazione) {
        return this.radioFormFunzioneVariazione.get('motivazione').invalid;
      }
    }
  }

  get countVariazioneRicorrenza() {
    if (!this.radioFormFunzioneVariazione || !this.radioFormFunzioneVariazione.get('qtyval')) {
      return 0;
    }
    return this.radioFormFunzioneVariazione.get('qtyval').value;
  }

  get motivazioneVariazioneRicorrenza() {
    if (!this.radioFormFunzioneVariazione || !this.radioFormFunzioneVariazione.get('motivazione')) {
      return 0;
    }
    return this.radioFormFunzioneVariazione.get('motivazione').value;
  }

  get motivazioneSocSanText() {
    if (!this.radioFormFunzioneVariazioneSocSan || !this.radioFormFunzioneVariazioneSocSan.get('motivazioneSocSan')) {
      return 0;
    }
    return this.radioFormFunzioneVariazioneSocSan.get('motivazioneSocSan').value;
  }

  get disabledButtonConfirmSocSan() {
    if (this.radioSelectedSocSan === 'ACC-PUN-PRIO') {
      return this.radioFormFunzioneVariazioneSocSan.get('valPunPrio').invalid;
    } else if (this.radioSelectedSocSan === 'ACC-PUN') {
      return this.radioFormFunzioneVariazioneSocSan.get('valPun').invalid;
    } else if (this.radioSelectedSocSan === 'RIF-SOCIO-SAN') {
      return this.radioFormFunzioneVariazioneSocSan.get('motivazioneSocSan').invalid;
    } else if (this.radioSelectedSocSan === 'RIF-RED-CON') {
      return this.radioFormFunzioneVariazioneSocSan.get('motivazioneSocSan').invalid;
    } else if (this.radioSelectedSocSan === 'RIF-RIC-INTEGR') {
      return this.radioFormFunzioneVariazioneSocSan.get('motivazioneSocSan').invalid;
    } else {
      return true;
    }
  }

  public returnTestataIstruttoria() {
    this.router.navigate(['istruttoria/verifiche/successive/caching']);
  }

  getStoricoVariazioni(idDomanda: string, condizionePunteggio: string) {
    this.istruttoriaService.getStoricoVariazioni(idDomanda, condizionePunteggio)
      .subscribe({
        next: (storicoVariazione: Array<StoricoVariazione>) => {
          this.storicoVariazione = storicoVariazione;
          let maxStoricoVar = 0;
          for (const variazione of this.storicoVariazione) {
            if (variazione.ricorrenza > maxStoricoVar) {
              maxStoricoVar = variazione.ricorrenza;
            }
          }
          this.maxFunzioneVariazione = maxStoricoVar;
          this.actualFunzioneVariazione = storicoVariazione[storicoVariazione.length - 1].ricorrenza;
          if (this.maxFunzioneVariazione === 1) {
            this.radioFormFunzioneVariazione.addControl('valida', new FormControl('',
              [Validators.required]));
            this.radioFormFunzioneVariazione.addControl('rifiuta', new FormControl('',
              [Validators.required]));
            this.radioFormFunzioneVariazione.addControl('motivazione', new FormControl('',
              [Validators.required, Validators.minLength(1), Validators.maxLength(500)]));
          } else if (this.maxFunzioneVariazione > 1) {
            this.radioFormFunzioneVariazione.addControl('qtyval', new FormControl('',
              [Validators.required, Validators.min(1), Validators.max(this.maxFunzioneVariazione)]));
            this.radioFormFunzioneVariazione.addControl('motivazione', new FormControl('',
              [Validators.required, Validators.minLength(1), Validators.maxLength(500)]));
          }
          this.radioFormFunzioneVariazioneSocSan.addControl('valPunPrio', new FormControl('',
            [Validators.required]));
          this.radioFormFunzioneVariazioneSocSan.addControl('valPun', new FormControl('',
            [Validators.required]));
          this.radioFormFunzioneVariazioneSocSan.addControl('rifSocSan', new FormControl('',
            [Validators.required]));
          this.radioFormFunzioneVariazioneSocSan.addControl('rifRedCon', new FormControl('',
            [Validators.required]));
          this.radioFormFunzioneVariazioneSocSan.addControl('rifRicInt', new FormControl('',
            [Validators.required]));
          this.radioFormFunzioneVariazioneSocSan.addControl('motivazioneSocSan', new FormControl('',
            [Validators.required, Validators.minLength(1), Validators.maxLength(500)]));
          this.loadStorico = true;
        },
        error: (data: SrvError) => {
          console.log('Errore: ' + JSON.stringify(data));
          this.globalError = true;
          setTimeout(() => {
            this.globalError = false;
          }, 9000);
        }
      });
  }

  decodificaStatoStoricoVariazione(codiceVariazione: string): string {
    return this.decodificaService.getStatoCondizionePunteggio(codiceVariazione);
  }

  get criterioCompilato() {
    let context = '';
    context += 'Condizione di punteggio = ' + this.descCodiceCondizionePunteggio;
    return context;
  }

  download(idFile: string, nameFile: string, codiceFiscaleRichiedente: string) {
    // Array.prototype.find() unsupported on IE
    this.istruttoriaService.getFile(this.idDomanda, idFile, nameFile, codiceFiscaleRichiedente).subscribe(() => {
    }, error => {
      console.log(error, 'Error downloading ' + idFile);
    });
  }

  getVerifichePreventive() {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.loginService.getUtenteLoggato()
      .subscribe({
        next: (data: UserInfo) => {
          const user = data;
          this.istruttoriaService.getElencoCondizioni(ordineScuola, user.codFisc, 'S')
            .subscribe({
              next: (verifiche: Array<CodiceDescrizioneIstruttoria>) => {
                this.verifiche = verifiche;
              }
            });
        },
        error: (data: SrvError) => {
          console.log('Errore: ' + JSON.stringify(data));
          this.globalError = true;
          setTimeout(() => {
            this.globalError = false;
          }, 9000);
        }
      });
  }

  get descCodiceCondizionePunteggio() {
    const codiCondizione = this.codiceCondizionePunteggio;
    if (this.verifiche) {
      for (const verfica of this.verifiche) {
        if (verfica.codice === codiCondizione) {
          return verfica.descrizione;
        }
      }
    }
    return '';
  }

  funzioneVariazione() {
    let ricorrenza;
    let codFunVar;
    if (this.maxFunzioneVariazione === 1) {
      if ((this.radioSelect === 'VAL')) {
        codFunVar = 'VAL';
        ricorrenza = 1;
      } else if (this.radioSelect === 'RIF') {
        codFunVar = 'RIF';
        ricorrenza = this.maxFunzioneVariazione;
      }
    } else if ((this.maxFunzioneVariazione > 1)) {
      if (this.countVariazioneRicorrenza <= this.maxFunzioneVariazione && this.countVariazioneRicorrenza > 0) {
        codFunVar = 'VAL';
        ricorrenza = this.countVariazioneRicorrenza;
      } else if (this.countVariazioneRicorrenza === 0) {
        codFunVar = 'RIF';
        ricorrenza = this.maxFunzioneVariazione;
      }
    }
    const funzioneVarazionePost: FunzioneVariazionePost = {
      validata: codFunVar,
      ricorrenza: ricorrenza,
      note: this.motivazioneVariazioneRicorrenza,
    };
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.istruttoriaService.funzioneVariazione(
      ordineScuola,
      funzioneVarazionePost,
      this.idDomanda,
      this.codiceCondizionePunteggio,
      this.storicoVariazione.length
    ).subscribe(
      data => {
        this.clearFormFunzioneBinaria();
        this.getStoricoVariazioni(this.idDomanda, this.codiceCondizionePunteggio);
      },
      error => {
        if (error && error.title && error.title.includes('VAL-IST-006')) {
          this.validationMessage = "Impossibile validare la condizione in quanto è già stata validata la condizione di problemi di salute del minore";
          this.validationError = true;
          setTimeout(() => {
            this.validationError = false;
            this.validationMessage = null;
          }, 9000);
        }
        else {
          this.globalError = true;
          setTimeout(() => {
            this.globalError = false;
          }, 9000);
        }
      }
    );
  }

  funzioneSocioSanitaria() {
    let ricorrenza;
    let codFunVar;
    if ((this.radioSelectedSocSan === 'ACC-PUN-PRIO' || this.radioSelectedSocSan === 'ACC-PUN')) {
      codFunVar = 'VAL';
      ricorrenza = 1;
    } else if (this.radioSelectedSocSan === 'RIF-SOCIO-SAN'
      || this.radioSelectedSocSan === 'RIF-RED-CON' || this.radioSelectedSocSan === 'RIF-RIC-INTEGR') {
      codFunVar = 'RIF';
      ricorrenza = this.maxFunzioneVariazione;
    }
    const funzioneSocioSanitariaPost: FunzioneSocioSanitariaPost = {
      validata: codFunVar,
      ricorrenza: ricorrenza,
      tipoValidazione: this.radioSelectedSocSan,
      note: this.motivazioneSocSanText,
    };
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.istruttoriaService.funzioneSocioSanitaria(
      ordineScuola,
      funzioneSocioSanitariaPost,
      this.idDomanda,
      this.codiceCondizionePunteggio,
      this.storicoVariazione.length
    ).subscribe(
      data => {
        this.clearFormFunzioneSocSan();
        this.getStoricoVariazioni(this.idDomanda, this.codiceCondizionePunteggio);
      },
      error => {
        if (error && error.title && error.title.includes('VAL-IST-006')) {
          this.validationMessage = "Impossibile validare la condizione in quanto è già stata validata la condizione di problemi di salute del minore";
          this.validationError = true;
          setTimeout(() => {
            this.validationError = false;
            this.validationMessage = null;
          }, 9000);
        }
        else {
          this.globalError = true;
          setTimeout(() => {
            this.globalError = false;
          }, 9000);
        }
      }
    );
  }

  private clearFormFunzioneBinaria() {
    if (this.maxFunzioneVariazione === 1) {
      this.radioFormFunzioneVariazione.removeControl('valida');
      this.radioFormFunzioneVariazione.removeControl('rifiuta');
      this.radioFormFunzioneVariazione.removeControl('motivazione');
    } else if (this.maxFunzioneVariazione > 1) {
      this.radioFormFunzioneVariazione.removeControl('qtyval');
      this.radioFormFunzioneVariazione.removeControl('motivazione');
    }
    this.radioSelect = '';
  }

  private clearFormFunzioneSocSan() {
    this.radioFormFunzioneVariazioneSocSan.removeControl('valPunPrio');
    this.radioFormFunzioneVariazioneSocSan.removeControl('valPun');
    this.radioFormFunzioneVariazioneSocSan.removeControl('rifSocSan');
    this.radioFormFunzioneVariazioneSocSan.removeControl('rifRedCon');
    this.radioFormFunzioneVariazioneSocSan.removeControl('rifRicInt');
    this.radioSelectedSocSan = '';
  }

  getCertificati() {
    this.istruttoriaService.getCertificati(this.idDomanda, this.codiceCondizionePunteggio)
      .subscribe({
        next: (allegati: Array<Allegato>) => {
          this.certificati = allegati;
        },
        error: (data: SrvError) => {
          console.log('Errore: ' + JSON.stringify(data));
          this.globalError = true;
          setTimeout(() => {
            this.globalError = false;
          }, 9000);
        }
      });
  }

}
