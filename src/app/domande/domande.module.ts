import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModuleCommonModuleModule } from '../common-module/module-common-module/module-common-module.module';
import { ModuleDirectiveModule } from '../directive/module-directive/module-directive.module';
import { DomandaService } from '../service/domanda.service';
import { SortService } from '../service/sort-service.service';
import { CondizioneOccupazionaleComponent } from './dettaglio-domanda/condizione-occupazionale/condizione-occupazionale.component';
import { CondizioneSocioSanitariaComponent } from './dettaglio-domanda/condizione-socio-sanitaria/condizione-socio-sanitaria.component';
import { DatiAnagraficiComponent } from './dettaglio-domanda/dati-anagrafici/dati-anagrafici.component';
import { DettaglioDomandaComponent } from './dettaglio-domanda/dettaglio-domanda.component';
import { ElencoNidiComponent } from './dettaglio-domanda/elenco-nidi/elenco-nidi.component';
import { FratellofrequentanteComponent } from './dettaglio-domanda/fratellofrequentante/fratellofrequentante.component';
import { ListaAttesaComponent } from './dettaglio-domanda/lista-attesa/lista-attesa.component';
import { DomandeMenuComponent } from './domande-menu/domande-menu.component';
import { PreferenzeScuolaModificaComponent } from './preferenze-scuola-modifica/preferenze-scuola-modifica.component';
import { PreferenzeScuolaComponent } from './preferenze-scuola/preferenze-scuola.component';
import { GruppoCriteriComponent } from './ricerca-domande-form/gruppo-criteri/gruppo-criteri.component';
import { RicercaDomandeFormComponent } from './ricerca-domande-form/ricerca-domande-form.component';
import { TestataDomandeComponent } from './testata-domande/testata-domande.component';

export const domandeRoutes: Routes = [
  // rotte del modulo Domande
  { path: 'domande/preferenze/ricerca', component: RicercaDomandeFormComponent, data: { cod: 'COD' } },
  { path: 'domande/ricerca', component: RicercaDomandeFormComponent, data: { cod: 'COD' } },
  { path: 'domande/ricerca/:caching', component: RicercaDomandeFormComponent, data: { cod: 'COD' } },
  { path: 'domande/domanda/:id', component: DettaglioDomandaComponent, data: { cod: 'COD' } },
  { path: 'domande/domanda/:id/preferenze', component: PreferenzeScuolaComponent, data: { cod: 'COD' } },
  { path: 'domande/domanda/:id/preferenze/modifica', component: PreferenzeScuolaModificaComponent, data: { cod: 'COD' } }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleDirectiveModule,
    NgbModule,
    ModuleCommonModuleModule,
    RouterModule.forRoot(
      domandeRoutes
    )
  ],
  declarations: [
    DomandeMenuComponent,
    RicercaDomandeFormComponent,
    GruppoCriteriComponent,
    TestataDomandeComponent, DettaglioDomandaComponent, DatiAnagraficiComponent,
    CondizioneSocioSanitariaComponent,
    CondizioneOccupazionaleComponent,
    ElencoNidiComponent, FratellofrequentanteComponent, PreferenzeScuolaComponent, PreferenzeScuolaModificaComponent, ListaAttesaComponent
  ],
  providers: [
    SortService,
    DomandaService
  ],
  exports: [DettaglioDomandaComponent, DatiAnagraficiComponent,
    CondizioneSocioSanitariaComponent,
    CondizioneOccupazionaleComponent,
    ElencoNidiComponent, FratellofrequentanteComponent]
})
export class DomandeModule {
}
