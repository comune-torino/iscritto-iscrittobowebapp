import { Component, Input, OnInit } from '@angular/core';
import { DatiAnnoListaAttesa, DatiListaAttesa, DomandaNido, ListaAttesa } from 'src/app/model/common/domanda-nido';

@Component({
  selector: 'app-lista-attesa',
  templateUrl: './lista-attesa.component.html',
  styleUrls: ['./lista-attesa.component.css']
})
export class ListaAttesaComponent implements OnInit {
  @Input() domandaNido: DomandaNido;

  constructor() { }

  ngOnInit() {
  }

  get isListaAttesa(): boolean {
    const listaAttesa: ListaAttesa = this.domandaNido.minore.listaAttesa;
    if (listaAttesa && listaAttesa.stato) {
      return true;
    }
    return false;
  }

  get descListaAttesa(): string {
    return this.isListaAttesa ? 'Si' : 'No';
  }

  get primoAnno(): DatiAnnoListaAttesa | null {
    if (this.isListaAttesa) {
      const dati: DatiListaAttesa = this.domandaNido.minore.listaAttesa.dati;
      if (dati && dati.primoAnno) {
        return dati.primoAnno;
      }
    }

    return null;
  }

  get secondoAnno(): DatiAnnoListaAttesa | null {
    if (this.isListaAttesa) {
      const dati: DatiListaAttesa = this.domandaNido.minore.listaAttesa.dati;
      if (dati && dati.secondoAnno) {
        return dati.secondoAnno;
      }
    }

    return null;
  }

}
