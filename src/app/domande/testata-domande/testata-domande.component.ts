import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {TestataDomanda} from '../../model/common/testata-domanda';
import {DomandaService} from '../../service/domanda.service';
import {Page} from '../../model/common/Page';

@Component({
  selector: 'app-testata-domande',
  templateUrl: './testata-domande.component.html',
  styleUrls: ['./testata-domande.component.css']
})
export class TestataDomandeComponent implements OnInit {

  // l'array delle chiavi domande risultato della ricerca (popolato nel componente RicercaDomandeForm)
  @Input()
  testataDomande: TestataDomanda[];
  @Input()
  isFromMps: boolean;
  sortTestataDomande: TestataDomanda[];
  page = new Page();
  startItem = 0;
  endItem = 0;
  rows: any = [];
  

  constructor(private domandaService: DomandaService) {
  }

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
        case 'codiceFiscaleMinore':
          return compare(a.codiceFiscaleMinore, b.codiceFiscaleMinore, isAsc);
        case 'statoDomandaDescrizione':
          return compare(a.statoDomandaDescrizione, b.statoDomandaDescrizione, isAsc);
        case 'dataUltimaModifica':
          const aData = a.dataUltimaModifica.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          const bData = b.dataUltimaModifica.match(/(\d{2})\/(\d{2})\/(\d{4})/);
          return compareDate(new Date(parseInt(aData[3], 10), parseInt(aData[2], 10) - 1, parseInt(aData[1], 10)).getTime(),
            new Date(parseInt(bData[3], 10), parseInt(bData[2], 10) - 1, parseInt(bData[1], 10)).getTime(), isAsc);
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
}

