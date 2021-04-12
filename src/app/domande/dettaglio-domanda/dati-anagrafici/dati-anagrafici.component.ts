import { Component, Input, OnInit } from '@angular/core';
import { Anagrafica, LuogoNascita, Residenza, Trasferimento } from 'src/app/model/common/domanda-nido';

@Component({
  selector: 'app-dati-anagrafici',
  templateUrl: './dati-anagrafici.component.html',
  styleUrls: ['./dati-anagrafici.component.css']
})
export class DatiAnagraficiComponent implements OnInit {

  @Input() anagraficaSoggetto: Anagrafica;
  @Input() luogoNascitaSoggetto: LuogoNascita;
  @Input() residenzaSoggetto: Residenza;
  @Input() cinqueAnniNonFrequentante: string;
  @Input() trasferimentoMinore: Trasferimento;
  constructor() { }

  ngOnInit() {
  }

  get showMinoreCinqueAnni(): boolean {
    return this.isMaterna && this.cinqueAnniNonFrequentante != null;
  }

  get descCinqueAnni(): string {
    if (this.cinqueAnniNonFrequentante != null) {
      if (this.cinqueAnniNonFrequentante == 'S') {
        return 'Minore 5 anni non frequentante'
      }

      if (this.cinqueAnniNonFrequentante == 'N' || this.cinqueAnniNonFrequentante == 'F') {
        return 'Minore 5 anni già frequentante'
      }
    }

    return '';
  }

  get descCambioScuolaFrequenza(): string {
    return this.trasferimentoMinore ? 'Si' : 'No';
  }

  get isMaterna(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'MAT';
  }

}
