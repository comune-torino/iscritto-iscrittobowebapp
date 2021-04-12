import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModuleCommonModuleModule } from '../common-module/module-common-module/module-common-module.module';
import { ModuleDirectiveModule } from '../directive/module-directive/module-directive.module';
import { GraduatoriaService } from '../service/graduatoria.service';
import { GraduatorieClassiRicercaComponent } from './graduatorie-classi-ricerca/graduatorie-classi-ricerca.component';
import { GraduatorieMenuComponent } from './graduatorie-menu/graduatorie-menu.component';
import { GraduatorieNuovaComponent } from './graduatorie-nuova/graduatorie-nuova.component';
import { GraduatorieReportComponent } from './graduatorie-report/graduatorie-report.component';
import { GraduatorieRicercaComponent } from './graduatorie-ricerca/graduatorie-ricerca.component';
import { GraduatorieStatoDomandaComponent } from './graduatorie-stato-domanda/graduatorie-stato-domanda.component';
import { GraduatorieRicercaDomandaComponent } from './graduatorie-ricerca-domanda/graduatorie-ricerca-domanda.component';
import { SelezioneScuolaAnnoComponent } from './selezione-scuola-anno/selezione-scuola-anno.component';
import { InserimentoAnagraficaComponent} from './inserimento-anagrafica/inserimento-anagrafica.component';
import { StepAnagraficaComponent} from './step-anagrafica/step-anagrafica.component';
import { StepInserisciComponent } from './step-inserisci/step-inserisci.component';
import { StepModificaComponent } from './step-modifica/step-modifica.component';
import { DomandaService } from '../service/domanda.service';
import { EtaAnagraficaComponent } from './eta-anagrafica/eta-anagrafica.component';
import { EtaInserisciComponent } from './eta-inserisci/eta-inserisci.component';
import { EtaModificaComponent } from './eta-modifica/eta-modifica.component';



// rotte del modulo Graduatorie
export const graduatorieRoutes: Routes = [
  { path: 'graduatorie/classi/ricerca', component: GraduatorieClassiRicercaComponent },
  { path: 'graduatorie/anagrafica', component: SelezioneScuolaAnnoComponent },
  { path: 'graduatorie/anagrafica/inserisci', component: InserimentoAnagraficaComponent },
  { path: 'graduatorie/anagrafica/step', component: StepAnagraficaComponent },
  { path: 'graduatorie/anagrafica/step/inserisci', component: StepInserisciComponent },
  { path: 'graduatorie/anagrafica/step/modifica', component: StepModificaComponent },
  { path: 'graduatorie/ricerca', component: GraduatorieRicercaComponent },
  { path: 'graduatorie/ricerca/:tipoRicerca', component: GraduatorieRicercaComponent },
  { path: 'graduatorie/nuova', component: GraduatorieNuovaComponent },
  { path: 'graduatorie/report', component: GraduatorieReportComponent },
  { path: 'graduatorie/modifica/stato/domanda', component: GraduatorieStatoDomandaComponent },
  { path: 'graduatorie/anagrafica/eta', component: EtaAnagraficaComponent },
  { path: 'graduatorie/anagrafica/eta/inserisci', component: EtaInserisciComponent },
  { path: 'graduatorie/anagrafica/eta/modifica', component: EtaModificaComponent }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleDirectiveModule,
    NgbModule,
    ModuleCommonModuleModule,
    RouterModule.forRoot(
      graduatorieRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  declarations: [GraduatorieMenuComponent, GraduatorieRicercaComponent, GraduatorieClassiRicercaComponent, GraduatorieNuovaComponent, GraduatorieReportComponent, GraduatorieStatoDomandaComponent, GraduatorieRicercaDomandaComponent, SelezioneScuolaAnnoComponent, InserimentoAnagraficaComponent, StepAnagraficaComponent, StepInserisciComponent, StepModificaComponent, EtaAnagraficaComponent, EtaInserisciComponent, EtaModificaComponent],
  providers: [
    GraduatoriaService,
    DomandaService
  ]
})
export class GraduatorieModule { }
