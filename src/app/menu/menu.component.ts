import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Funzione } from '../model/common/funzione';
import { SrvError } from '../model/common/srv-error';
import { AuthService } from '../service/auth.service';
import { ConfigService } from '../service/config.service';
import { ProfileService } from '../service/profile.service';
import { Profilo } from '../model/common/profilo';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  private _macroFunzioni: Funzione[];
  actualMenu: string;
  error: SrvError;
  coin: boolean = false;
  profiloAttuale: Profilo;
  profiliDisponibili: Profilo[];
  showSceltaProfilo: boolean;
  fgSelezionaProfilo: FormGroup = new FormGroup({});
  mostraPag : Boolean;
  sceltaP : boolean;

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    private config: ConfigService,
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (event.url.startsWith('/domande')) {
        this.actualMenu = 'DOM';
      } else if (event.url.startsWith('/istruttoria')) {
        this.actualMenu = 'IST';
      } else if (event.url.startsWith('/graduatorie')) {
        this.actualMenu = 'GRA';
      } else if (event.url.startsWith('/utenti')) {
        this.actualMenu = 'UTE';
      }
    });
  }

  ngOnInit() {

     

    if (this.hideMaterne) {
      this.nidiOnClick();
    }

    this.authService.checkOperatore().subscribe({
      next: (data: string) => {
        this.profileService.getElencoMacroFunzioni().subscribe({
          next: (data: Funzione[]) => {
            if (data.length > 0) {
              this._macroFunzioni = data;
              const initFunzione = this._macroFunzioni[0];
              this.router.navigate([initFunzione.link + '/' + initFunzione.codice]);
            } else {
              this.router.navigate(['/noAbilitazioni']);
              
            }
          },
          error: (data: SrvError) => {
            this.error = data;
            console.log('Errore: ' + JSON.stringify(this.error));
          },
        });
      },
      error: (data: SrvError) => {
        this.mostraPag = true;
        this.authService.jumpToUnauthorizedPage();
      },
    });

    if (this.macroFunzioni != null) {
      console.log('macroFunzioni: ' + JSON.stringify(this.macroFunzioni));
    } else {
      console.error('Dati di profilazione NON presenti a sistema');
    }


    //EVOLUTIVA PROFILO
   
/*
    if(sessionStorage.getItem("mostraProfili")=="si"){
      this.showSceltaProfilo = true;

      this.profileService.getElencoProfili().subscribe({
          next:(response: Profilo[]) => {
            if(response){
              let prof: Profilo[]=[];
              for(let item of response){
                prof.push({
                  codice: item.codice,
                  descrizione: item.descrizione
                });
              }
              this.profiliDisponibili = prof;

            }
          }
        });
    }else if(sessionStorage.getItem("mostraProfili")=="no"){
      this.showSceltaProfilo = false;
     
    }

    this.fgSelezionaProfilo.addControl('profiloScelto', new FormControl(null, [Validators.required]));
*/
      
  }

  
  public get macroFunzioni(): Funzione[] {
    return this._macroFunzioni;
  }

  get isNido(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'NID';
  }

  get isMaterna(): boolean {
    return sessionStorage.getItem('ordineScuola') == 'MAT';
  }

  get hideMaterne(): boolean {
    return this.config.hideMaterne();
  }

  get sceltaProfili(): boolean{

    return sessionStorage.getItem('sceltaProfilo')=='si';
    
  }

  get primoAccesso(): boolean{

    return sessionStorage.getItem("primoAccesso")=='si';

  }
  

  nidiOnClick() {
    this.coin = true;
    sessionStorage.setItem('ordineScuola', 'NID');
  }

  materneOnClick() {
    this.coin = true;
    sessionStorage.setItem('ordineScuola', 'MAT');
  }

}

