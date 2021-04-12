import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { Attivita } from '../../model/common/attivita';
import { Funzione } from '../../model/common/funzione';
import { SrvError } from '../../model/common/srv-error';
import { ProfileService } from '../../service/profile.service';

@Component({
  selector: 'app-utenti-menu',
  templateUrl: './utenti-menu.component.html',
  styleUrls: ['./utenti-menu.component.css']
})
export class UtentiMenuComponent implements OnInit {

  codiceFunzione: string;
  private _elencoAttivita: Attivita[];

  public get elencoAttivita(): Attivita[] {
    console.log("Attivita': " + JSON.stringify(this._elencoAttivita))
    return this._elencoAttivita;
  }
  public set elencoAttivita(value: Attivita[]) {
    this._elencoAttivita = value;
  }
    
  error: SrvError

  /*
  attivitas: Attivita[] = [
    { codice: 'NEWUTE', descrizione: 'nuovo Utente', codiceTipo: 'F2', codiceFunzione: 'UTE', link: '' },
    { codice: 'GESTUTE', descrizione: 'ricerca e gestione Utente', codiceTipo: 'F2', codiceFunzione: 'UTE', link: '' }
    
  ];
  */

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.route.params.subscribe((params) => this.codiceFunzione = params.codiceFunzione);
    console.info("codice funzione: "+this.codiceFunzione);
    
    this.profileService.getElencoMacroFunzioni().subscribe
    ({
      next: (data: Funzione[]) => {
        data.forEach(element => {
          if(element.codice == this.codiceFunzione)
          this._elencoAttivita = element.attivita;
        });
        
      },
      error: (data: SrvError) => {
        this.error = data;
        console.log("Errore: " + JSON.stringify(this.error))
      },
    });

    console.info("attivita: "+JSON.stringify(this.elencoAttivita));
  }

}
