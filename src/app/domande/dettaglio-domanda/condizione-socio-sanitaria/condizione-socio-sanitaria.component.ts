import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { InfoScuola } from 'src/app/model/common/info-scuola';
import { Profilo } from 'src/app/model/common/profilo';
import { RicevutaAllegato } from 'src/app/model/ricevuta-allegato';
import { PrintService } from 'src/app/print.service';
import { AllegatoService } from 'src/app/service/allegato.service';
import { IstruttoriaService } from 'src/app/service/istruttoria.service';
import { Anagrafica, DatiServiziSociali, Disabilita, ElencoNidi, Gravidanza, Minore, ProblemiSalute, ServiziSociali } from '../../../model/common/domanda-nido';
import { Richiedente } from '../../../model/common/richiedente';
import { SrvError } from '../../../model/common/srv-error';
import { UserInfo } from '../../../model/common/user-info';
import { DomandaService } from '../../../service/domanda.service';
import { LoginService } from '../../../service/login.service';
import { ProfileService } from '../../../service/profile.service';

@Component({
  selector: 'app-condizione-socio-sanitaria',
  templateUrl: './condizione-socio-sanitaria.component.html',
  styleUrls: ['./condizione-socio-sanitaria.component.css']
})
export class CondizioneSocioSanitariaComponent implements OnInit, OnDestroy {
  @Input() statoDomanda: string;
  @Input() idSoggetto: any;
  @Input() minore: Minore;
  @Input() idDomandaIscrizione: any;
  @Input() richiedente: Richiedente;
  @Input() isSoggetto: boolean;
  @Input() isMinore: boolean;
  @Input() disabilita: Disabilita;
  @Input() serviziSociali: ServiziSociali;
  @Input() problemiSalute: ProblemiSalute;
  @Input() gravidanza: Gravidanza;
  @Input() anagraficaSoggetto: Anagrafica;
  @Input() istruttoria = false;
  @Input() elencoNidi: ElencoNidi[];
  user: UserInfo;
  // pendingFilesPresent: boolean;
  // isUploadingFiles: boolean = null;
  datiServiziSociali: DatiServiziSociali;

  docDisabilita: Array<any> = [];
  docProblemiSalute: Array<any> = [];
  docGravidanza: Array<any> = [];
  docServiziSociali: Array<any> = [];

  filesDisabilita: Array<any> = [];
  filesProblemiSalute: Array<any> = [];
  filesGravidanza: Array<any> = [];
  filesServiziSociali: Array<any> = [];

  successStatusDisabilita = false;
  errorStatusDisabilita = false;
  errorStatusMessageDisabilita = '';

  successStatusProblemiSalute = false;
  errorStatusProblemiSalute = false;
  errorStatusMessageProblemiSalute = '';

  successStatusGravidanza = false;
  errorStatusGravidanza = false;
  errorStatusMessageGravidanza = '';

  successStatusServiziSociali = false;
  errorStatusServiziSociali = false;
  errorStatusMessageServiziSociali = '';

  profili: Profilo[] = [];
  scuoleUtente: string[] = [];

  private isPrinterReady$: Observable<boolean>
  private printRequested: boolean = false
  private subscription: Subscription

  constructor(
    private domandaService: DomandaService,
    private profileService: ProfileService,
    private loginService: LoginService,
    private printService: PrintService,
    private datePipe: DatePipe,
    private allegatoService: AllegatoService,
    private istruttoriaService: IstruttoriaService
  ) { }

  ngOnInit() {
    this.getUtente();
    this.initProfili();
    this.initElencoScuoleUtente();

    if (this.hasDisabilita && this.disabilita.documenti.length > 0) {
      this.docDisabilita = this.disabilita.documenti;
    }
    if (this.hasServiziSociali) {
      this.datiServiziSociali = this.serviziSociali.dati;
      this.docServiziSociali = this.serviziSociali.documenti;
    }
    if (this.hasProblemiSalute && this.problemiSalute.documenti.length > 0) {
      this.docProblemiSalute = this.problemiSalute.documenti;
    }
    if (this.hasGravidanza && this.gravidanza.documenti.length > 0) {
      this.docGravidanza = this.gravidanza.documenti;
    }

    this.isPrinterReady$ = this.printService.getPrinterReadySemaphore()
    this.subscription = this.isPrinterReady$.subscribe(b => {
      if (this.printRequested) {
        window.print()
        this.printRequested = false;
      }
    })
  }

  get hasDisabilita(): boolean {
    return this.disabilita != null && this.disabilita.stato === true;
  }

  get hasDisabilitaText(): string {
    if (this.hasDisabilita) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  get hasProblemiSalute(): boolean {
    return this.problemiSalute != null && this.problemiSalute.stato === true;
  }

  get hasProblemiSaluteText(): string {
    if (this.hasProblemiSalute) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  get hasServiziSociali(): boolean {
    return this.serviziSociali != null && this.serviziSociali.stato === true;
  }

  get hasServiziSocialiText(): string {
    if (this.hasServiziSociali) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  get hasGravidanza(): boolean {
    return this.gravidanza != null && this.gravidanza.stato === true;
  }

  get hasGravidanzaText(): string {
    if (this.hasGravidanza) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  get hasPrivilegioUpload(): boolean {
    if (this.istruttoria) {
      return false;
    }

    return this.profileService.hasPrivilegioUpload();
  }

  get canDownloadAllegato(): boolean {
    const profilo: Profilo = this.getProfiloCorrente();
    if (profilo == null) {
      // il profilo non e' ancora stato restituito
      return false;
    }

    if (this.profileService.hasPrivilegioDownloadAllegati()) {
      return true;
    }

    if (this.isMinore && this.profileService.hasPrivilegioDownloadAllegatiMinore()) {
      if (profilo.codice == this.profileService.CODICE_PROFILO_ECONOMA) {
        if (this.statoDomanda == 'ACC' && this.isScuolaAccettataVisibile()) {
          return true;
        }
      }
      else {
        return true;
      }
    }

    return false;
  }

  handleFileDisabilita(target) {
    if ((this.filesDisabilita.length + this.docDisabilita.length) >= 5) {
      this.errorStatusMessageDisabilita = 'Puoi caricare massimo 5 file.';
      this.errorStatusDisabilita = true;
      setTimeout(() => {
        // IE11
        this.errorStatusDisabilita = false;
      }, 9000);
      return;
    }
    for (let i = 0; i < target.files.length; i++) {
      if (!target.files.item(i).name.toLowerCase().endsWith('.pdf')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpeg')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpg')) {
        this.errorStatusMessageDisabilita = 'Solo file PDF, JPEG o JPG posso essere caricati. ';
        this.errorStatusDisabilita = true;
        setTimeout(() => {
          // IE11
          this.errorStatusDisabilita = false;
        }, 9000);
        continue;
      }
      if (target.files.item(i).size > Math.pow(2, 20) * 2) {
        this.errorStatusMessageDisabilita = 'File size is too big, it should be less than 2 MB. ';
        this.errorStatusDisabilita = true;
        setTimeout(() => {
          // IE11
          this.errorStatusDisabilita = false;
        }, 9000);
        continue;
      }
      this.filesDisabilita.push({
        fileName: target.files.item(i).name,
        file: target.files.item(i),
        isUpload: false
      });
      this.errorStatusDisabilita = false;
      // this.pendingFilesPresent = true;
    }
    target.value = null;
  }

  removeFileDisabilita(fileToRemove) {
    let i = -1;
    // this.pendingFilesPresent = false;
    this.filesDisabilita.forEach((file, j) => {
      if (file.idFile) {
        return;
      }
      if (file === fileToRemove) {
        i = j;
      } else {
        // this.pendingFilesPresent = true;
      }
    });
    if (i !== -1) {
      this.filesDisabilita.splice(i, 1);
    }
  }

  uploadDisabilita(pendingFiles) {
    const codTipologia = 'DIS';
    if (typeof pendingFiles === 'undefined') {
      pendingFiles = this.filesDisabilita.map(
        (f, i) => {
          f.i = i;
          return f;
        }
      ).filter(f => !f.idFile);
    }
    if (pendingFiles.length === 0) {
      this.errorStatusMessageDisabilita = 'Nessun file aggiunto.';
      this.errorStatusDisabilita = true;
      return;
    } else if (this.errorStatusDisabilita) {
      this.errorStatusMessageDisabilita = 'Impossibile caricare i file. ';
      this.errorStatusDisabilita = true;
    }
    const filesToUpload = pendingFiles;
    let uploadedCount = 0;
    filesToUpload.forEach(fileToUpload => {
      const currentFile = this.filesDisabilita[fileToUpload.i];
      this.domandaService.postFile(fileToUpload.file, this.idDomandaIscrizione,
        this.idSoggetto, codTipologia, this.richiedente.anagrafica.codiceFiscale, this.user.codFisc).subscribe((data: any) => {
          uploadedCount++;
          if (uploadedCount === filesToUpload.length) {
            this.filesDisabilita = [];
            this.successStatusDisabilita = true;
            setTimeout(() => {
              this.successStatusDisabilita = false;
            }, 6000);
          }
          currentFile.isUpload = true;
          for (const doc of data.result) {
            this.docDisabilita.push(doc);
          }
        }, error => {
          this.filesDisabilita = [];
          throw error;
        });
    });
  }

  handleFileProblemiSalute(target) {
    if ((this.filesProblemiSalute.length + this.docProblemiSalute.length) >= 5) {
      this.errorStatusMessageProblemiSalute = 'Puoi caricare massimo 5 file alla volta.';
      this.errorStatusProblemiSalute = true;
      setTimeout(() => {
        // IE11
        this.errorStatusProblemiSalute = false;
      }, 9000);
      return;
    }
    for (let i = 0; i < target.files.length; i++) {
      if (!target.files.item(i).name.toLowerCase().endsWith('.pdf')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpeg')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpg')) {
        this.errorStatusMessageProblemiSalute = 'Solo file PDF o JPEG posso essere caricati. ';
        this.errorStatusProblemiSalute = true;
        setTimeout(() => {
          // IE11
          this.errorStatusProblemiSalute = false;
        }, 9000);
        continue;
      }
      if (target.files.item(i).size > Math.pow(2, 20) * 2) {
        this.errorStatusMessageProblemiSalute = 'File size is too big, it should be less than 2 MB. ';
        this.errorStatusProblemiSalute = true;
        setTimeout(() => {
          // IE11
          this.errorStatusProblemiSalute = false;
        }, 9000);
        continue;
      }
      this.filesProblemiSalute.push({
        fileName: target.files.item(i).name,
        file: target.files.item(i),
        isUpload: false
      });
      this.errorStatusProblemiSalute = false;
      // this.pendingFilesPresent = true;
    }
    target.value = null;
  }

  removeFileProblemiSalute(fileToRemove) {
    let i = -1;
    // this.pendingFilesPresent = false;
    this.filesProblemiSalute.forEach((file, j) => {
      if (file.idFile) {
        return;
      }
      if (file === fileToRemove) {
        i = j;
      } else {
        // this.pendingFilesPresent = true;
      }
    });
    if (i !== -1) {
      this.filesProblemiSalute.splice(i, 1);
    }
  }

  uploadProblemiSalute(pendingFiles) {
    const codTipologia = 'SAL';
    if (typeof pendingFiles === 'undefined') {
      pendingFiles = this.filesProblemiSalute.map(
        (f, i) => {
          f.i = i;
          return f;
        }
      ).filter(f => !f.idFile);
    }
    if (pendingFiles.length === 0) {
      // this.isUploadingFiles = false;
      this.errorStatusMessageProblemiSalute = 'Nessun file aggiunto.';
      this.errorStatusProblemiSalute = true;
      return;
    } else if (this.errorStatusProblemiSalute) {
      this.errorStatusMessageProblemiSalute = 'Impossibile caricare i file. ';
      this.errorStatusProblemiSalute = true;
    }
    const filesToUpload = pendingFiles;
    let uploadedCount = 0;
    filesToUpload.forEach(fileToUpload => {
      const currentFile = this.filesProblemiSalute[fileToUpload.i];
      this.domandaService.postFile(fileToUpload.file, this.idDomandaIscrizione,
        this.idSoggetto, codTipologia, this.richiedente.anagrafica.codiceFiscale, this.user.codFisc).subscribe((data: any) => {
          uploadedCount++;
          currentFile.isUpload = true;
          if (uploadedCount === filesToUpload.length) {
            this.filesProblemiSalute = [];
            this.successStatusProblemiSalute = true;
            setTimeout(() => {
              // IE11
              this.successStatusProblemiSalute = false;
            }, 6000);
          }
          for (const doc of data.result) {
            this.docProblemiSalute.push(doc);
          }
        }, error => {
          this.filesProblemiSalute = [];
          throw error;
        });
    });
  }

  handleFileGravidanza(target) {
    if ((this.filesGravidanza.length + this.docGravidanza.length) >= 5) {
      this.errorStatusMessageGravidanza = 'Puoi caricare massimo 5 file alla volta.';
      this.errorStatusGravidanza = true;
      setTimeout(() => {
        // IE11
        this.errorStatusGravidanza = false;
      }, 9000);
      return;
    }
    for (let i = 0; i < target.files.length; i++) {
      if (!target.files.item(i).name.toLowerCase().endsWith('.pdf')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpeg')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpg')) {
        this.errorStatusMessageGravidanza = 'Solo file PDF o JPEG posso essere caricati. ';
        this.errorStatusGravidanza = true;
        setTimeout(() => {
          // IE11
          this.errorStatusGravidanza = false;
        }, 9000);
        continue;
      }
      if (target.files.item(i).size > Math.pow(2, 20) * 2) {
        this.errorStatusMessageGravidanza = 'File size is too big, it should be less than 2 MB. ';
        this.errorStatusGravidanza = true;
        setTimeout(() => {
          // IE11
          this.errorStatusGravidanza = false;
        }, 9000);
        continue;
      }
      this.filesGravidanza.push({
        fileName: target.files.item(i).name,
        file: target.files.item(i),
        isUpload: false
      });
      this.errorStatusGravidanza = false;
    }
    target.value = null;
  }

  removeFileGravidanza(fileToRemove) {
    let i = -1;
    this.filesGravidanza.forEach((file, j) => {
      if (file.idFile) {
        return;
      }
      if (file === fileToRemove) {
        i = j;
      } else {
        // this.pendingFilesPresent = true;
      }
    });
    if (i !== -1) {
      this.filesGravidanza.splice(i, 1);
    }
  }

  uploadGravidanza(pendingFiles) {
    const codTipologia = 'GRA';
    if (typeof pendingFiles === 'undefined') {
      pendingFiles = this.filesGravidanza.map(
        (f, i) => {
          f.i = i;
          return f;
        }
      ).filter(f => !f.idFile);
    }
    if (pendingFiles.length === 0) {
      // this.isUploadingFiles = false;
      this.errorStatusMessageGravidanza = 'Nessun file aggiunto.';
      this.errorStatusGravidanza = true;
      return;
    } else if (this.errorStatusGravidanza) {
      this.errorStatusMessageGravidanza = 'Impossibile caricare i file. ';
      this.errorStatusGravidanza = true;
    }
    const filesToUpload = pendingFiles;
    let uploadedCount = 0;
    filesToUpload.forEach(fileToUpload => {
      const currentFile = this.filesGravidanza[fileToUpload.i];
      this.domandaService.postFile(fileToUpload.file, this.idDomandaIscrizione,
        this.idSoggetto, codTipologia, this.richiedente.anagrafica.codiceFiscale, this.user.codFisc).subscribe((data: any) => {
          uploadedCount++;
          currentFile.isUpload = true;
          if (uploadedCount === filesToUpload.length) {
            this.filesProblemiSalute = [];
            this.successStatusGravidanza = true;
            setTimeout(() => {
              this.successStatusGravidanza = false;
            }, 6000);
          }
          for (const doc of data.result) {
            this.docGravidanza.push(doc);
          }
        }, error => {
          this.filesProblemiSalute = [];
          throw error;
        });
    });
  }

  handleFileServiziSociali(target) {
    if ((this.filesServiziSociali.length + this.docServiziSociali.length) >= 5) {
      this.errorStatusMessageServiziSociali = 'Puoi caricare massimo 5 file alla volta.';
      this.errorStatusServiziSociali = true;
      setTimeout(() => {
        // IE11
        this.errorStatusServiziSociali = false;
      }, 9000);
      return;
    }
    for (let i = 0; i < target.files.length; i++) {
      if (!target.files.item(i).name.toLowerCase().endsWith('.pdf')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpeg')
        && !target.files.item(i).name.toLowerCase().endsWith('.jpg')) {
        this.errorStatusMessageServiziSociali = 'Solo file PDF o JPEG posso essere caricati. ';
        this.errorStatusServiziSociali = true;
        setTimeout(() => {
          // IE11
          this.errorStatusServiziSociali = false;
        }, 9000);
        continue;
      }
      if (target.files.item(i).size > Math.pow(2, 20) * 2) {
        this.errorStatusMessageServiziSociali = 'File size is too big, it should be less than 2 MB. ';
        this.errorStatusServiziSociali = true;
        setTimeout(() => {
          // IE11
          this.errorStatusServiziSociali = false;
        }, 9000);
        continue;
      }
      this.filesServiziSociali.push({
        fileName: target.files.item(i).name,
        file: target.files.item(i),
        isUpload: false
      });
      this.errorStatusServiziSociali = false;
    }
    target.value = null;
  }

  removeFileServiziSociali(fileToRemove) {
    let i = -1;
    this.filesServiziSociali.forEach((file, j) => {
      if (file.idFile) {
        return;
      }
      if (file === fileToRemove) {
        i = j;
      } else {
        // this.pendingFilesPresent = true;
      }
    });
    if (i !== -1) {
      this.filesServiziSociali.splice(i, 1);
    }
  }

  uploadServiziSociali(pendingFiles) {
    const codTipologia = 'SER';
    if (typeof pendingFiles === 'undefined') {
      pendingFiles = this.filesServiziSociali.map(
        (f, i) => {
          f.i = i;
          return f;
        }
      ).filter(f => !f.idFile);
    }
    if (pendingFiles.length === 0) {
      // this.isUploadingFiles = false;
      this.errorStatusMessageServiziSociali = 'Nessun file aggiunto.';
      this.errorStatusServiziSociali = true;
      return;
    } else if (this.errorStatusServiziSociali) {
      this.errorStatusMessageServiziSociali = 'Impossibile caricare i file. ';
      this.errorStatusServiziSociali = true;
    }
    const filesToUpload = pendingFiles;
    let uploadedCount = 0;
    filesToUpload.forEach(fileToUpload => {
      const currentFile = this.filesServiziSociali[fileToUpload.i];
      this.domandaService.postFile(fileToUpload.file, this.idDomandaIscrizione,
        this.idSoggetto, codTipologia, this.richiedente.anagrafica.codiceFiscale, this.user.codFisc).subscribe((data: any) => {
          uploadedCount++;
          currentFile.isUpload = true;
          if (uploadedCount === filesToUpload.length) {
            this.filesServiziSociali = [];
            this.successStatusServiziSociali = true;
            setTimeout(() => {
              this.successStatusServiziSociali = false;
            }, 6000);
          }
          for (const doc of data.result) {
            this.docServiziSociali.push(doc);
          }
        }, error => {
          this.filesServiziSociali = [];
          throw error;
        });
    });
  }

  getUtente() {
    this.loginService.getUtenteLoggato()
      .subscribe({
        next: (data: UserInfo) => {
          this.user = data;
        },
        error: (data: SrvError) => {
          console.log('Errore: ' + JSON.stringify(data));
        },
      });
  }

  stampaAllegato(id: number) {
    this.allegatoService.getRicevutaAllegato(id).subscribe({
      next: (response: RicevutaAllegato) => {
        var ricevutaDomanda = new RicevutaAllegato();
        ricevutaDomanda.clone(response, this.datePipe);
        this.printRequested = true;
        this.printService.setMessage(ricevutaDomanda.getPrintable());
      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
      },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.printService.setMessage("");
  }

  downloadAllegato(idFile: string, nameFile: string) {
    this.istruttoriaService.getFile(this.idDomandaIscrizione, idFile, nameFile, this.richiedente.anagrafica.codiceFiscale).subscribe(() => {
    }, error => {
      console.log(error, 'Error downloading ' + idFile);
    });
  }

  private initProfili(): void {
    this.profileService.getElencoProfili().subscribe({
      next: (response: Profilo[]) => {
        if (response && response.length > 0) {
          this.profili = response;
        }
      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
      },
    });
  }

  private initElencoScuoleUtente(): void {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.scuoleUtente = [];

    this.domandaService.getScuoleByUtente(ordineScuola).subscribe({
      next: (data: InfoScuola[]) => {
        if (data) {
          this.scuoleUtente = data.map(x => x.codScuola);
        }
      },
      error: (data: SrvError) => {
        console.log('Errore: ' + JSON.stringify(data));
      }
    });
  }

  private getProfiloCorrente(): Profilo {
    // TODO: adeguare la logica quando ci saranno piu' profili
    if (this.profili && this.profili.length > 0) {
      return this.profili[0];
    }

    return null;
  }

  private isScuolaAccettataVisibile(): boolean {
    const codScuolaAccettata = this.getCodScuolaAccettata();
    if (this.scuoleUtente && codScuolaAccettata) {
      for (let scuola of this.scuoleUtente) {
        if (codScuolaAccettata == scuola) {
          return true;
        }
      }
    }

    return false;
  }

  private getCodScuolaAccettata(): string {
    if (this.elencoNidi) {
      for (let scuola of this.elencoNidi) {
        if (scuola.codStatoScuola && scuola.codStatoScuola == 'ACC') {
          return scuola.codScuola;
        }
      }
    }

    return null;
  }

}
