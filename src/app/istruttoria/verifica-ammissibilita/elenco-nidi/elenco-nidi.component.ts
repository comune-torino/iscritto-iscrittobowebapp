import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Allegato } from 'src/app/model/common/Allegato';
import { Anagrafica, DomandaNido, ElencoNidi } from 'src/app/model/common/domanda-nido';
import { SrvError } from 'src/app/model/common/srv-error';
import { DecodificaService } from 'src/app/service/decodifica.service';
import { DomandaService } from 'src/app/service/domanda.service';
import { IstruttoriaService } from 'src/app/service/istruttoria.service';

@Component({
  selector: 'app-elenco-nidi',
  templateUrl: './elenco-nidi.component.html',
  styleUrls: ['./elenco-nidi.component.css']
})
export class ElencoNidiComponent implements OnInit {
  ordineScuola: string = "";

  domandaNido$: Observable<DomandaNido | SrvError>;
  domandaNido: DomandaNido;
  statusSearchDomanda = false;

  certificatiDisabilita: Allegato[] = [];
  certificatiProblemiSalute: Allegato[] = [];

  errorLoadDomanda: boolean = false;
  errorSalvaStatoNidi: boolean = false;

  constructor(
    private domandaService: DomandaService,
    private decodificaService: DecodificaService,
    private istruttoriaService: IstruttoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    
    this.ordineScuola = sessionStorage.getItem('ordineScuola');

    this.errorLoadDomanda = false;
    this.errorSalvaStatoNidi = false;

    this.statusSearchDomanda = true;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaNido$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.domandaService.getDomandaById(ordineScuola, parseInt(params.get('id')))
      )
    );

    this.domandaNido$.subscribe({
      next: (data: DomandaNido) => {
        this.domandaNido = data;
        this.initElencoNidi();
        this.getCertificatiDisabilitaMinore();
        this.getCertificatiProblemiSaluteMinore();
        this.statusSearchDomanda = false;
      },
      error: (data: SrvError) => {
        console.log('Errore: ' + JSON.stringify(data));
        this.statusSearchDomanda = false;

        this.errorLoadDomanda = true;
        setTimeout(() => {
          this.errorLoadDomanda = false;
        }, 9000);
      },
    });
  }

  get anagraficaMinore(): Anagrafica {
    return this.domandaNido.minore.anagrafica;
  }

  get elencoNidi(): ElencoNidi[] {
    let result: ElencoNidi[] = [];
    if (this.domandaNido.elencoNidi != null && this.domandaNido.elencoNidi.length !== 0) {
      for (const nido of this.domandaNido.elencoNidi) {
        if (
          nido.codStatoScuola !== null &&
          nido.codStatoScuola !== this.domandaService.STATO_SCUOLA_PENDENTE &&
          nido.codStatoScuola !== this.domandaService.STATO_SCUOLA_NON_AMMISSIBILE
        ) {
          continue;
        }
        result.push(nido);
      }
    }
    return result;
  }

  public returnToElencoDomande() {
    this.router.navigate(['/istruttoria/verifiche/ammissibilita']);
  }

  public salvaStatoNidi() {
    this.statusSearchDomanda = true;
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.modificaStatoScuole(
      ordineScuola,
      this.domandaNido.idDomandaIscrizione,
      this.domandaNido.statoDomanda,
      this.domandaNido.elencoNidi
    ).subscribe({
      next: (response: any) => {
        this.domandaService.getDomandaById(ordineScuola, this.domandaNido.idDomandaIscrizione).subscribe({
          next: (data: DomandaNido) => {
            this.domandaNido = data;
            this.initElencoNidi();
            this.statusSearchDomanda = false;
          },
          error: (data: SrvError) => {
            console.log('Errore: ' + JSON.stringify(data));
            this.statusSearchDomanda = false;

            this.errorLoadDomanda = true;
            setTimeout(() => {
              this.errorLoadDomanda = false;
            }, 9000);
          },
        });
      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
        this.statusSearchDomanda = false;

        this.errorSalvaStatoNidi = true;
        setTimeout(() => {
          this.errorSalvaStatoNidi = false;
        }, 9000);
      },
    })
  }

  getTipologiaFrequenzaScuola(nido: ElencoNidi): string {
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    return this.decodificaService.getTipologiaFrequenzaScuola(nido.codTipoFrequenza, ordineScuola);
  }

  getFuoriTermineText(valueFuoriTermine): string {
    if (valueFuoriTermine) {
      return 'Si';
    } else {
      return 'No';
    }
  }

  getDescStatoScuola(codStatoScuola: string): string {
    return this.decodificaService.isAmmissibile(codStatoScuola) ? 'Si' : 'No';
  }

  getCertificatiDisabilitaMinore() {
    this.istruttoriaService.getCertificati(this.domandaNido.idDomandaIscrizione, 'PA_DIS')
      .subscribe({
        next: (allegati: Array<Allegato>) => {
          this.certificatiDisabilita = this.getAllegatiByTipo(this.getAllegatiBySoggetto(allegati, 'MIN'), 'DIS');
        }
      });
  }

  getCertificatiProblemiSaluteMinore() {
    this.istruttoriaService.getCertificati(this.domandaNido.idDomandaIscrizione, 'PA_PRB_SAL')
      .subscribe({
        next: (allegati: Array<Allegato>) => {
          this.certificatiProblemiSalute = this.getAllegatiByTipo(this.getAllegatiBySoggetto(allegati, 'MIN'), 'SAL');
        }
      });
  }

  download(idFile: string, nameFile: string, codiceFiscaleRichiedente: string) {
    this.istruttoriaService.getFile(
      this.domandaNido.idDomandaIscrizione, idFile, nameFile, codiceFiscaleRichiedente).subscribe(() => {
      }, error => {
        console.log(error, 'Error downloading ' + idFile);
      });
  }

  //////////////////////////////////////////////////////////////////////

  private initElencoNidi(): void {
    if (this.domandaNido.elencoNidi != null && this.domandaNido.elencoNidi.length !== 0) {
      for (const nido of this.domandaNido.elencoNidi) {
        nido.ammissibile = this.decodificaService.isAmmissibile(nido.codStatoScuola);
      }
    }
  }

  private getAllegatiBySoggetto(allegati: Array<Allegato>, tipoSoggetto: string): Array<Allegato> {
    let result: Array<Allegato> = [];
    if (allegati && allegati.length) {
      for (const allegato of allegati) {
        if (allegato.codTipoSoggetto === tipoSoggetto) {
          result.push(allegato);
        }
      }
    }
    return result;
  }

  private getAllegatiByTipo(allegati: Array<Allegato>, codTipoAllegato: string): Array<Allegato> {
    let result: Array<Allegato> = [];
    if (allegati && allegati.length) {
      for (const allegato of allegati) {
        if (allegato.codTipoAllegatoRed && allegato.codTipoAllegatoRed === codTipoAllegato) {
          result.push(allegato);
        }
        else if (allegato.codTipoAllegato && allegato.codTipoAllegato === codTipoAllegato) {
          result.push(allegato);
        }
      }
    }
    return result;
  }

}
