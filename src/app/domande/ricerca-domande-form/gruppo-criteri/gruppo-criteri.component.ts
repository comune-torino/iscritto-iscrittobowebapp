import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-gruppo-criteri',
  templateUrl: './gruppo-criteri.component.html',
  styleUrls: ['./gruppo-criteri.component.css']
})
export class GruppoCriteriComponent implements OnInit {

  @Input() raggruppamentoSelezionato: string;
  raggruppamento: string[] = ['CF', 'CC', 'PD', 'SS'];

  @Output() emitRaggruppamento = new EventEmitter<string>();
  raggruppamentoSelected = 'CF';

  CriterioForm = new FormGroup({});

  constructor() { }

  ngOnInit() {
    this.CriterioForm.addControl('criterio', new FormControl());
    this.CriterioForm.get('criterio').setValue(this.raggruppamentoSelezionato);
  }

  /*
  * Metodo di callback richiamato all'evento onChange del radio button selezionato
  */
  onSelectionChange(raggruppamento: string) {
    this.raggruppamentoSelected = raggruppamento;
    // emetto l'evento che consente al parent component di leggere il raggruppamento scelto
    this.emitRaggruppamento.emit(raggruppamento);
  }
}
