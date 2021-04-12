import {Component, OnInit, Input} from '@angular/core';
import {CondizioneOccupazionale, Dipendente, Autonomo, Disoccupato, Studente, NonOccupato} from '../../../model/common/domanda-nido';
import {DecodificaService} from '../../../service/decodifica.service';


@Component({
  selector: 'app-condizione-occupazionale',
  templateUrl: './condizione-occupazionale.component.html',
  styleUrls: ['./condizione-occupazionale.component.css']
})
export class CondizioneOccupazionaleComponent implements OnInit {

  @Input() condizioneOccupazionale: CondizioneOccupazionale;

  constructor(private decodificaService: DecodificaService) {
  }

  ngOnInit() {
  }

  get hasCondizioneOccupazionale(): boolean {
    if (this.condizioneOccupazionale &&
      this.condizioneOccupazionale.stato !== null
      && this.condizioneOccupazionale.stato === this.decodificaService.NO_CONDIZIONE_OCCUPAZIONALE) {
      return false;
    } else {
      return true;
    }
  }

  get condizioneOccupazionaleText(): string {
    if (this.condizioneOccupazionale) {
      return this.decodificaService.getCondizioneOccupazionale(this.condizioneOccupazionale.stato);
    }
  }

  get dipendente(): Dipendente | null {
    if (this.condizioneOccupazionale && this.condizioneOccupazionale.stato === this.decodificaService.DIPENDENTE) {
      return this.condizioneOccupazionale.dati.dipendente;
    }
    return null;
  }

  get autonomo(): Autonomo | null {
    if (this.condizioneOccupazionale && this.condizioneOccupazionale.stato === this.decodificaService.AUTONOMO) {
      return this.condizioneOccupazionale.dati.autonomo;
    }
    return null;
  }

  get disoccupato(): Disoccupato | null {
    if (this.condizioneOccupazionale && this.condizioneOccupazionale.stato === this.decodificaService.DISOCCUPATO) {
      return this.condizioneOccupazionale.dati.disoccupato;
    }
    return null;
  }

  get studente(): Studente | null {
    if (this.condizioneOccupazionale && this.condizioneOccupazionale.stato === this.decodificaService.STUDENTE) {
      return this.condizioneOccupazionale.dati.studente;
    }
    return null;
  }

  get periodiLavorativi(): NonOccupato[] | null {
    if (this.condizioneOccupazionale && this.condizioneOccupazionale.stato === this.decodificaService.OCCUPATO_PARZIALE
      && this.condizioneOccupazionale.dati.nonOccupato != null
      && this.condizioneOccupazionale.dati.nonOccupato.length !== 0) {
      return this.condizioneOccupazionale.dati.nonOccupato;
    }
    return null;
  }

  soggettoDichiarazione(disoccupato: Disoccupato) {
    if (disoccupato.soggettoDichiarazione === 'CI') {
      return 'Centro per l impiego';
    } else if (disoccupato.soggettoDichiarazione === 'PA') {
      return 'Portale ANPAL';
    } else if (disoccupato.soggettoDichiarazione === 'PI') {
      return 'Portale INPS';
    }
  }

}
