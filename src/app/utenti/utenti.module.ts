import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtentiMenuComponent } from './utenti-menu/utenti-menu.component';
import { RouterModule, Routes } from '@angular/router';
import { UtentiNuovoComponent } from './utenti-nuovo/utenti-nuovo.component';
import { UtentiRicercaComponent } from './utenti-ricerca/utenti-ricerca.component';

// rotte del modulo istruttoria
export const utentiRoutes: Routes = [
  { path: 'utenti/ricerca', component: UtentiRicercaComponent },
  { path: 'utenti/nuovo', component: UtentiNuovoComponent }
]  

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      utentiRoutes,
      // { enableTracing: true } // <-- debugging purposes only
    ),
  ],
  declarations: [UtentiMenuComponent, UtentiNuovoComponent, UtentiRicercaComponent]
})
export class UtentiModule { }
