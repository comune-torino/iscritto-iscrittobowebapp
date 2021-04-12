import { Component, Input, OnInit } from '@angular/core';
import { Anagrafica, DatiNidoContiguo, FratelloFrequentante, NidoContiguo } from '../../../model/common/domanda-nido';
import { DecodificaService } from '../../../service/decodifica.service';

@Component({
  selector: 'app-fratellofrequentante',
  templateUrl: './fratellofrequentante.component.html',
  styleUrls: ['./fratellofrequentante.component.css']
})
export class FratellofrequentanteComponent implements OnInit {
  @Input() fratelloFrequentante: FratelloFrequentante;
  @Input() fratelloNidoContiguo: NidoContiguo;

  constructor(
    private decodificaService: DecodificaService
  ) { }

  ngOnInit() {
  }

  get isFratelloFrequentante(): boolean {
    if (this.fratelloFrequentante && this.fratelloFrequentante.stato) {
      return true;
    }
    return false;
  }

  get isFratelloNidoContiguo(): boolean {
    if (this.fratelloNidoContiguo && this.fratelloNidoContiguo.stato) {
      return true;
    }
    return false;
  }

  get fratelloFrequentateMinoreTipologia(): string {
    return this.decodificaService.getFratelloFrequentateMinoreTipologia(this.fratelloFrequentante.tipo);
  }

  get fratelloFrequentateMinoreAnagrafica(): Anagrafica {
    return this.fratelloFrequentante.anagrafica;
  }

  get datiFratelloNidoContiguo(): Anagrafica {
    if (this.fratelloNidoContiguo) {
      return this.fratelloNidoContiguo.anagrafica;
    }
    return null;
  }

  get datiNidoContiguo(): DatiNidoContiguo {
    if (this.fratelloNidoContiguo) {
      return this.fratelloNidoContiguo.nidoContiguo;
    }
    return null;
  }

}
