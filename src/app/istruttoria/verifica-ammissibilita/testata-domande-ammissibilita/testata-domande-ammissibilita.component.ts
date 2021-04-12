import { Component, OnInit, Input } from '@angular/core';
import { TestataDomandaDaVerificare } from 'src/app/model/common/testata-domanda';
import { Page } from 'src/app/model/common/Page';
import { DomandaService } from 'src/app/service/domanda.service';
import { DecodificaService } from 'src/app/service/decodifica.service';

@Component({
  selector: 'app-testata-domande-ammissibilita',
  templateUrl: './testata-domande-ammissibilita.component.html',
  styleUrls: ['./testata-domande-ammissibilita.component.css']
})
export class TestataDomandeAmmissibilitaComponent implements OnInit {
  ordineScuola: string = "";

  @Input()
  testataDomande: TestataDomandaDaVerificare[];
  sortTestataDomande: TestataDomandaDaVerificare[];
  page = new Page();
  startItem = 0;
  endItem = 0;
  rows: any = [];

  constructor(
    private domandaService: DomandaService,
    private decodificaService: DecodificaService
  ) { }

  ngOnInit() {
    this.ordineScuola = sessionStorage.getItem('ordineScuola');

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
          return compare(a.protocollo, b.protocollo, isAsc);
        case 'cognomeMinore':
          return compare(this.toLowerCase(a.cognomeMinore), this.toLowerCase(b.cognomeMinore), isAsc);
        case 'codiceFiscaleMinore':
          return compare(a.codiceFiscaleMinore, b.codiceFiscaleMinore, isAsc);
        case 'statoDomandaDescrizione':
          return compare(this.getDescrizioneStatoDomanda(a), this.getDescrizioneStatoDomanda(b), isAsc);
        case 'condizionePunteggioDescrizione':
          return compare(this.getDescrizioneCondizionePunteggio(a), this.getDescrizioneCondizionePunteggio(b), isAsc);
        default:
          return 0;
      }
    }).slice(this.startItem, this.endItem);

    function compare(a: number | string, b: number | string, isAsc: boolean) {
      const comparison = a < b ? -1 : (a > b ? 1 : 0);
      return comparison * (isAsc ? 1 : -1);
    }
  }

  getDescrizioneStatoDomanda(row: TestataDomandaDaVerificare): string {
    let result: string = "";
    if (row) {
      if (row.codStatoDomanda) {
        result += this.decodificaService.statoDomandaCodice(row.codStatoDomanda);
      }
    }
    return result;
  }

  getDescrizioneCondizionePunteggio(row: TestataDomandaDaVerificare): string {
    let result: string[] = [];
    if (row) {
      if (row.paDis) {
        result.push("Disabilità");
      }
      if (row.paPrbSal) {
        result.push("Problemi di salute");
      }
    }
    return result.join(", ")
  }

  private toLowerCase(value: string): string {
    return value ? value.toLowerCase() : null;
  }

}
