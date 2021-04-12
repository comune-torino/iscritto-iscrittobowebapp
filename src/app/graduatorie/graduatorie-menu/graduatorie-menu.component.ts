import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import {MenuComponent} from '../../menu/menu.component';
import { Attivita } from '../../model/common/attivita';
import { SrvError } from '../../model/common/srv-error';
import { ProfileService } from '../../service/profile.service';
import { Funzione } from '../../model/common/funzione';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-graduatorie-menu',
  templateUrl: './graduatorie-menu.component.html',
  styleUrls: ['./graduatorie-menu.component.css']
})


export class GraduatorieMenuComponent implements OnInit {

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
  
    { codice: 'NVGRD', descrizione: 'Nuova graduatoria', codiceTipo: 'F2', codiceFunzione: 'GRD',link: '' },
    { codice: 'GSTGRD', descrizione: 'Ricerca e gestione graduatorie', codiceTipo: 'F2', codiceFunzione: 'GRD',link: '' },
    { codice: 'GSTCLS', descrizione: 'Ricerca e gestione classi', codiceTipo: 'F2', codiceFunzione: 'GRD',link: '' },
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
