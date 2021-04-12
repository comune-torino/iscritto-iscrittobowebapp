import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';
import { Attivita } from '../../model/common/attivita';
import { SrvError } from '../../model/common/srv-error';
import { ProfileService } from '../../service/profile.service';
import { Funzione } from '../../model/common/funzione';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-istruttoria-menu',
  templateUrl: './istruttoria-menu.component.html',
  styleUrls: ['./istruttoria-menu.component.css']
})
export class IstruttoriaMenuComponent implements OnInit {
  globalError: boolean = false;

  codiceFunzione = 'IST';
  private _elencoAttivita: Attivita[];
  public get elencoAttivita(): Attivita[] {
    console.log('Attivita: ' + JSON.stringify(this._elencoAttivita));
    return this._elencoAttivita;
  }

  error: SrvError;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.route.params.subscribe((params) => this.codiceFunzione = params.codiceFunzione);
    console.log('codice funzione: ' + this.codiceFunzione);
    this.profileService.getElencoMacroFunzioni().subscribe({
      next: (data: Funzione[]) => {
        data.forEach(element => {
          if (element.codice === this.codiceFunzione) {
            this._elencoAttivita = element.attivita;
          }
        });
      },
      error: (data: SrvError) => {
        this.error = data;
        console.log('Errore: ' + JSON.stringify(this.error));

        this.globalError = true;
        setTimeout(() => {
          this.globalError = false;
        }, 9000);
      },
    });
    console.log('attivita: ' + JSON.stringify(this.elencoAttivita));
  }
}
