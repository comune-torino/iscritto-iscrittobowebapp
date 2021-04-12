import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Attivita } from '../../model/common/attivita';
import { Funzione } from '../../model/common/funzione';
import { SrvError } from '../../model/common/srv-error';
import { ConfigService } from '../../service/config.service';
import { LoginService } from '../../service/login.service';
import { ProfileService } from '../../service/profile.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-domande-menu',
  templateUrl: './domande-menu.component.html',
  styleUrls: ['./domande-menu.component.css']
})

export class DomandeMenuComponent implements OnInit {
  globalError: boolean = false;

  codiceFunzione: string;
  private _elencoAttivita: Attivita[];

  public get elencoAttivita(): Attivita[] {
    console.log('Attivita\': ' + JSON.stringify(this._elencoAttivita));
    return this._elencoAttivita;
  }

  public set elencoAttivita(value: Attivita[]) {
    this._elencoAttivita = value;
  }

  error: SrvError;

  // devo poter accedere alle abilitazioni dell'utente loggato
  // attivitas: Attivita[] = [
  // { codice: 'RICDOM', descrizione: 'ricerca e gestione Domande', codiceTipo: 'F2', codiceFunzione: 'DOM', link: '/domande/ricerca' }
  // ];

  constructor(private route: ActivatedRoute,
    private profileService: ProfileService,
    private loginService: LoginService,
    private configService: ConfigService,
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
        console.log(this.elencoAttivita);
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
  }

  public jumpToURLContoTerzi() {
    console.log(this.configService.getContoTerziURL());
    this.loginService.jumpToURLContoTerzi(this.configService.getContoTerziURL());
  }

  public jumpToLink(url: string) {
    this.loginService.jumpToURL(url);
  }

  public isContoTerzi(codice: string): boolean {
    if (codice === 'INS_DOM') {
      return true;
    } else {
      return false;
    }
  }

}
