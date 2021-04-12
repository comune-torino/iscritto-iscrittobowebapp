import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IstruttoriaMenuComponent } from './istruttoria-menu/istruttoria-menu.component';
import { RouterModule, Routes } from '@angular/router';
import { IstruttoriaGestioneComponent } from './istruttoria-gestione/istruttoria-gestione.component';
import { VerifichepreventiveComponent } from './verifichepreventive/verifichepreventive.component';
import { IstruttoriaService } from '../service/istruttoria.service';
import { TestataIstruttoriaComponent } from './testata-istruttoria/testata-istruttoria.component';
import { VerifichesuccessiveComponent } from './verifichesuccessive/verifichesuccessive.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModuleDirectiveModule } from '../directive/module-directive/module-directive.module';
import { ModuleCommonModuleModule } from '../common-module/module-common-module/module-common-module.module';
import { DettaglioDomandaPreventiveComponent }
  from './verifichepreventive/dettaglio-domanda-preventive/dettaglio-domanda-preventive.component';
import { DettaglioDomandaSuccessiveComponent }
  from './verifichesuccessive/dettaglio-domanda-successive/dettaglio-domanda-successive.component';
import { DomandeModule } from '../domande/domande.module';
import { ExcelServiceService } from '../service/excel-service.service';
import { CommissioneHComponent } from './commissione-h/commissione-h.component';
import { VerificaAmmissibilitaComponent } from './verifica-ammissibilita/verifica-ammissibilita.component';
import { TestataDomandeAmmissibilitaComponent } from './verifica-ammissibilita/testata-domande-ammissibilita/testata-domande-ammissibilita.component';
import { DomandaService } from '../service/domanda.service';
import { ElencoNidiComponent } from './verifica-ammissibilita/elenco-nidi/elenco-nidi.component';

export const istruttoriaRoutes: Routes = [
  { path: 'istruttoria/gestione', component: IstruttoriaGestioneComponent },
  { path: 'istruttoria/verifiche/successive', component: VerifichesuccessiveComponent },
  { path: 'istruttoria/verifiche/preventive', component: VerifichepreventiveComponent },
  { path: 'istruttoria/verifiche/preventive/:caching', component: VerifichepreventiveComponent },
  { path: 'istruttoria/verifiche/successive/:caching', component: VerifichesuccessiveComponent },
  {
    path: 'istruttoria/preventive/domanda/:id/:codiceCondizionePunteggio/codTipoIstruttoria/:codTipoIstruttoria/:ricorrenza',
    component: DettaglioDomandaPreventiveComponent
  },
  {
    path: 'istruttoria/successive/domanda/:id/:codiceCondizionePunteggio/codTipoIstruttoria/:codTipoIstruttoria/:ricorrenza',
    component: DettaglioDomandaSuccessiveComponent
  },
  { path: 'istruttoria/stampa/commissione/:codTipoCommissione', component: CommissioneHComponent },
  { path: 'istruttoria/verifiche/ammissibilita', component: VerificaAmmissibilitaComponent },
  { path: 'istruttoria/verifiche/ammissibilita/domanda/:id/preferenze', component: ElencoNidiComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModuleDirectiveModule,
    NgbModule,
    DomandeModule,
    ModuleCommonModuleModule,
    RouterModule.forRoot(
      istruttoriaRoutes
    ),
  ],
  declarations: [IstruttoriaMenuComponent, IstruttoriaGestioneComponent,
    VerifichepreventiveComponent, TestataIstruttoriaComponent, VerifichesuccessiveComponent,
    DettaglioDomandaPreventiveComponent, DettaglioDomandaSuccessiveComponent, CommissioneHComponent, VerificaAmmissibilitaComponent, TestataDomandeAmmissibilitaComponent, ElencoNidiComponent],
  providers: [
    DomandaService,
    IstruttoriaService,
    ExcelServiceService,
    DatePipe
  ]
})
export class IstruttoriaModule {
}
