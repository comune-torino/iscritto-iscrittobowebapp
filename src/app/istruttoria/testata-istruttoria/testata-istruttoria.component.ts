import { Component, Input, OnInit } from '@angular/core';
import { TestataDomandaCodPunteggio } from '../../model/common/Testata-domanda-cod-punteggio';
import { Page } from '../../model/common/Page';
import { ExcelServiceService } from '../../service/excel-service.service';
import { DecodificaService } from '../../service/decodifica.service';


@Component({
  selector: 'app-testata-istruttoria',
  templateUrl: './testata-istruttoria.component.html',
  styleUrls: ['./testata-istruttoria.component.css']
})
export class TestataIstruttoriaComponent implements OnInit {
  @Input()
  testataDomande: TestataDomandaCodPunteggio[];
  @Input()
  preventiva: boolean;
  @Input()
  codiceCondizionePunteggio: string;
  @Input()
  codTipoIstruttoria: string;
  sortTestataDomande: TestataDomandaCodPunteggio[];
  page = new Page();
  startItem = 0;
  endItem = 0;
  rows: any = [];

  constructor(
    private excelService: ExcelServiceService,
    private decodificaService: DecodificaService
  ) { }

  ngOnInit() {
    this.page.pageNumber = 0;
    this.page.totalElements = 0;
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.startItem = 0;
    this.endItem = this.page.size;
    this.sortTestataDomande = this.testataDomande;
    if (this.testataDomande.length > 0) {
      this.rows = this.testataDomande.slice(this.startItem, this.endItem);
    }
    this.page.totalElements = this.testataDomande.length;
    this.page.totalPages = this.page.totalElements / this.page.size;
  }

  changePage(pageNumber) {
    this.page.pageNumber = pageNumber;
    this.startItem = (this.page.pageNumber - 1) * this.page.size;
    this.endItem = this.startItem + this.page.size;
    this.rows = this.sortTestataDomande.slice(this.startItem, this.endItem);
  }

  onSorted(infoSort) {
    this.sortTestataDomande = this.testataDomande;
    this.rows = this.sortTestataDomande.sort((a, b) => {
      const isAsc = infoSort.sortDirection === 'asc';
      switch (infoSort.sortColumn) {
        case 'protocolloDomandaIscrizione':
          return compare(a.protocolloDomandaIscrizione, b.protocolloDomandaIscrizione, isAsc);
        case 'cognomeMinore':
          return compare(a.cognomeMinore, b.cognomeMinore, isAsc);
        case 'statoDomandaCodice':
          return compare(a.statoDomandaCodice, b.statoDomandaCodice, isAsc);
        case 'dataConsegna':
          const aData = a.dataConsegna.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          const bData = b.dataConsegna.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          return compareDate(new Date(parseInt(aData[3], 10), parseInt(aData[2], 10) - 1, parseInt(aData[1], 10)).getTime(),
            new Date(parseInt(bData[3], 10), parseInt(bData[2], 10) - 1, parseInt(bData[1], 10)).getTime(), isAsc);
        case 'indirizzo':
          return compare(a.indirizzo, b.indirizzo, isAsc);
        case 'ricorrenza':
          return compare(a.ricorrenza, b.ricorrenza, isAsc);
        default:
          return 0;
      }
    }).slice(this.startItem, this.endItem);

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      const comparison = a < b ? -1 : (a > b ? 1 : 0);
      return comparison * (isAsc ? 1 : -1);
    }

    function compareDate(a: number | string, b: number | string, isAsc: boolean) {
      const comparison = a < b ? -1 : (a > b ? 1 : 0);
      return ((a === null && b !== null) ? -1 : (b === null ? 1 : comparison)) * (isAsc ? 1 : -1);
    }
  }

  statoDomandaCodice(codiceVariazione: string): string {
    return this.decodificaService.statoDomandaCodice(codiceVariazione);
  }

  exportAsXLSX(): void {

    // poichè il JSON che rappresenta l'elenco delle testate domande trovate non è adatto per
    // as-is nel report excel di output, occorre popolare un nuovo oggetto JSNON da offire
    // al servizio di produzione dell'excel
    const testataXlsArray: TestataDomandaExcel[] = new Array();
    let _testata: TestataDomandaExcel;

    // ciclo sugli elementi nativi di testata domanda
    this.testataDomande.forEach((element, index) => {

      // tslint:disable-next-line: no-use-before-declare
      _testata = new TestataDomandaExcel();
      _testata.protocolloDomandaIscrizione = element.protocolloDomandaIscrizione;
      _testata.cognomeMinore = element.cognomeMinore;
      _testata.nomeMinore = element.nomeMinore;
      _testata.statoDomanda = element.statoDomandaCodice;
      _testata.statoCondizionePunteggio = this.decodificaService.getStatoCondizionePunteggio(element.codStatoValidazione);
      _testata.dataConsegna = element.dataConsegna;
      _testata.dataUltimaModifica = element.dataUltimaModifica;
      _testata.nidoPrimaScelta = element.indirizzo;
      _testata.ricorrenza = element.ricorrenza;

      testataXlsArray.push(_testata);
    });

    console.log('JSON Excel: ' + JSON.stringify(testataXlsArray));

    this.excelService.exportAsExcelFile(testataXlsArray, 'sample');
  }

  get isNido(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'NID';
  }

  get isMaterna(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'MAT';
  }
}



/*
Classe che rappresenta la testata domande da riportare nell'excel di output.
(Riporta meno dati e nomi di colonna diversi rispetto alla testata restituita dal servizio di backend)
*/
export class TestataDomandaExcel {
  nomeMinore: string;
  cognomeMinore: string;
  protocolloDomandaIscrizione: string;
  statoDomanda: string;
  dataConsegna: string;
  dataUltimaModifica: string;
  nidoPrimaScelta: string;
  ricorrenza: string;
  statoCondizionePunteggio: string;
}
