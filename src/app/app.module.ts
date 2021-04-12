import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { ModuleDirectiveModule } from './directive/module-directive/module-directive.module';
import { DomandeMenuComponent } from './domande/domande-menu/domande-menu.component';
import { DomandeModule } from './domande/domande.module';
import { FooterComponent } from './footer/footer.component';
import { GraduatorieMenuComponent } from './graduatorie/graduatorie-menu/graduatorie-menu.component';
import { GraduatorieModule } from './graduatorie/graduatorie.module';
import { HeaderComponent } from './header/header.component';
import { HomePageComponent } from './home-page/home-page.component';
import { IstruttoriaMenuComponent } from './istruttoria/istruttoria-menu/istruttoria-menu.component';
import { IstruttoriaModule } from './istruttoria/istruttoria.module';
// import { IstruttoriaComponent } from './istruttoria/istruttoria.component';
// import { GraduatorieComponent } from './graduatorie/graduatorie.component';
// import { UtentiComponent } from './utenti/utenti.component';
import { MenuComponent } from './menu/menu.component';
import { NoAbilitazioniComponent } from './no-abilitazioni/no-abilitazioni.component';
import { ConfigService } from './service/config.service';
import { DecodificaService } from './service/decodifica.service';
import { LoginService } from './service/login.service';
import { ProfileService } from './service/profile.service';
import { UtentiMenuComponent } from './utenti/utenti-menu/utenti-menu.component';
import { UtentiModule } from './utenti/utenti.module';
import { CourtesyPageComponent } from './util/courtesy-page/courtesy-page.component';
import { PageNotFoundComponent } from './util/page-not-found/page-not-found.component';
import { UnauthorizedUserComponent } from './util/unauthorized-user/unauthorized-user.component';
import { AuthService } from './service/auth.service';
import { PrintComponent } from './print/print.component';








export const appRoutes: Routes = [
  { path: 'noAbilitazioni', component: NoAbilitazioniComponent },
  { path: 'domande/:codiceFunzione', component: DomandeMenuComponent },
  { path: 'graduatorie/:codiceFunzione', component: GraduatorieMenuComponent },
  { path: 'istruttoria/:codiceFunzione', component: IstruttoriaMenuComponent },
  { path: 'utenti/:codiceFunzione', component: UtentiMenuComponent },
  { path: 'courtesypage', component: CourtesyPageComponent },
  { path: 'unauthorized', component: UnauthorizedUserComponent },
  { path: '**', component: PageNotFoundComponent }
];
 

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    CourtesyPageComponent,
    HomePageComponent,
    NoAbilitazioniComponent,
    UnauthorizedUserComponent,
    PrintComponent,
    
   
    
    
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
    NgbModule,
    DomandeModule,
    IstruttoriaModule,
    GraduatorieModule,
    UtentiModule,
    ModuleDirectiveModule,
  ],
  providers: [
    LoginService,
    ConfigService,
    ProfileService,
    DecodificaService,
    AuthService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}


