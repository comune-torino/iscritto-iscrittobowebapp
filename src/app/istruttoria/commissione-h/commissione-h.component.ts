import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CommissioneH } from '../../model/common/CommissioneH';
import { SrvError } from '../../model/common/srv-error';
import { ExcelServiceService } from '../../service/excel-service.service';
import { IstruttoriaService } from '../../service/istruttoria.service';

@Component({
  selector: 'app-commissione-h',
  templateUrl: './commissione-h.component.html',
  styleUrls: ['./commissione-h.component.css']
})
export class CommissioneHComponent implements OnInit {
  globalError: boolean = false;
  statusSearch: boolean = false;

  filtroRicercaForm: FormGroup = new FormGroup({});
  codTipoCommissione: string;

  constructor(
    private istruttoriaService: IstruttoriaService,
    private excelSevice: ExcelServiceService,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.filtroRicercaForm.addControl('fromToDate', new FormControl('', [Validators.required]));
    this.filtroRicercaForm.addControl('toDate', new FormControl('', [Validators.required]));

    this.route.params.subscribe(params => {
      this.codTipoCommissione = params['codTipoCommissione'];
    });
  }

  onSubmit() {
    const fromToDate = this.datepipe.transform(this.fromToDate, 'yyyy-MM-dd');
    const toDate = this.datepipe.transform(this.toDate, 'yyyy-MM-dd');

    const dal: string = this.datepipe.transform(this.fromToDate, 'dd/MM/yyyy');
    const al: string = this.datepipe.transform(this.toDate, 'dd/MM/yyyy');

    const ordineScuola: string = sessionStorage.getItem('ordineScuola');

    switch (this.codTipoCommissione) {
      case 'h':
        this.istruttoriaService.commissioneH(ordineScuola, fromToDate, toDate).subscribe({
          next: (response: CommissioneH[]) => {
            this.excelSevice.exportAsExcelFileWithRow(
              this.mapRows(response),
              `Allegato commissione H per le date dal ${dal} al ${al}`,
              `Commissione_H_from_${fromToDate}_to_${toDate}`);
          },
          error: (response: SrvError) => {
            this.globalError = true;
            setTimeout(() => {
              this.globalError = false;
            }, 9000);
          },
        });
        break;
      case 's':
        this.istruttoriaService.commissioneS(ordineScuola, fromToDate, toDate).subscribe({
          next: (response: CommissioneH[]) => {
            this.excelSevice.exportAsExcelFileWithRow(
              this.mapRows(response),
              `Allegato commissione S per le date dal ${dal} al ${al}`,
              `Commissione_S_from_${fromToDate}_to_${toDate}`);
          },
          error: (response: SrvError) => {
            this.globalError = true;
            setTimeout(() => {
              this.globalError = false;
            }, 9000);
          },
        });
        break;
    }
  }

  onReset() {
  }

  get fromToDate() {
    return this.filtroRicercaForm.get('fromToDate').value;
  }

  get toDate() {
    return this.filtroRicercaForm.get('toDate').value;
  }

  get disabledButtonSearch() {
    return !(this.filtroRicercaForm.valid);
  }

  private mapRows(rows: CommissioneH[]): any[] {
    const json = rows.map(row => {
      return {
        'Protocollo': row.protocollo,
        'Nome minore': row.nomeMinore,
        'Cognome minore': row.cognomeMinore,
        'Codice fiscale minore': row.codiceFiscaleMinore,
        'Esito': row.esito,
        'Data validazione': row.dataValidazione,
        'Data rifiuto': row.dataRifiuto,
        'Nome scuola prima scelta': row.nomeScuolaPrimaScelta,
        'Indirizzo scuola prima scelta': row.indirizzoScuolaPrimaScelta
      }
    });
    return json;
  }

}
