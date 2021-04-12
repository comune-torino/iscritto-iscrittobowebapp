import { Profilo } from './../model/common/profilo';
import { ProfileService } from './../service/profile.service';
import { Component, OnInit } from '@angular/core';
import { SrvError } from '../model/common/srv-error';
import { UserInfo } from '../model/common/user-info';
import { LoginService } from '../service/login.service';
import { AuthService } from '../service/auth.service';
import { ConfigService } from '../service/config.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  utente: UserInfo;
  error: SrvError;
  profilo: Profilo;
  profAttuale: String;
  profiloSelezionato: Profilo;
  paginaProfilo: String;
  profiliDisponibili: Profilo[];
  mostraPag: Boolean;
  showSceltaProfilo: boolean;
  fgSelezionaProfilo: FormGroup = new FormGroup({});
  profiloAttuale: string;



  constructor(
    private config: ConfigService,
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit() {


    if (sessionStorage.getItem("cambioProfilo") == "si") {
      sessionStorage.setItem("cambioProfilo", "no")

      this.controlloUtenteProfilo();

      this.profileService.getElencoProfili().subscribe({
        next: (response: Profilo[]) => {
          if (response) {
            let prof: Profilo[] = [];
            for (let item of response) {
              prof.push({
                codice: item.codice,
                descrizione: item.descrizione
              });
            }
            this.profiliDisponibili = prof;

          }
        }
      });
    } else {


      sessionStorage.setItem("primoAccesso", "si")

      this.controlloUtenteProfilo();

      this.profileService.getElencoProfili().subscribe({
        next: (response: Profilo[]) => {
          if (response) {
            let prof: Profilo[] = [];
            for (let item of response) {
              prof.push({
                codice: item.codice,
                descrizione: item.descrizione
              });
            }
            this.profiliDisponibili = prof;

            if (this.profiliDisponibili[1] === undefined) {

              sessionStorage.setItem("profiloSingolo", "si")
              sessionStorage.setItem("primoAccesso", "no")
            } else {
              console.log("ha più profili")
              this.showSceltaProfilo = true
              sessionStorage.setItem("sceltaProfilo", "si")

            }

          }
        }
      });
    }
    this.fgSelezionaProfilo.addControl('profiloScelto', new FormControl(null, [Validators.required]));

  }

  onClickSelectProfilo() {

    console.log("mostro i profili")
    if (sessionStorage.getItem("profiloSingolo") != "si") {
      this.showSceltaProfilo = true
      sessionStorage.setItem("sceltaProfilo", "si")
    }

  }



  SSOLogout(): void {
    this.loginService.SSOLogout();
  }

  localLogout(): void {
    this.loginService.localLogout();
  }

  getUtente(): UserInfo {
    return this.utente;
  }

  getProfilo(): String {
    return this.profiloAttuale;
  }


  private onClickProfilo(): void {
    let pScelto = this.fgSelezionaProfilo.value.profiloScelto;

    console.log("cliccato vai: ", pScelto)
    if (pScelto.codice != null) {

      console.log("set PROFILO")
      this.showSceltaProfilo = false;
      sessionStorage.setItem("sceltaProfilo", "no")
      sessionStorage.setItem("primoAccesso", "no")
      this.profiloAttuale = pScelto.descrizione;
      this.profileService.setProfilo(pScelto.codice).subscribe(
        res => {
          console.log("Profilo settato")
        },
        error => {
          console.log("Errore set profilo")
        }
      )

      sessionStorage.setItem("cambioProfilo", "si")
      window.location.reload();
    }
  }

  private controlloUtenteProfilo():void{
    this.loginService.getUtenteLoggato().subscribe({
      next: (data: UserInfo) => {
        this.utente = data;
        this.utente.ruolo = data.codRuolo;
        console.log(this.utente);
        sessionStorage.setItem("cfOperatore",data.codFisc)
        this.authService.checkOperatore().subscribe({
          next: (data: string) => {
            // OK
          },
          error: (data: SrvError) => {
            this.authService.jumpToUnauthorizedPage();
          },
        });
      },
      error: (data: SrvError) => {
        this.error = data;
        console.log('Errore: ' + JSON.stringify(this.error));
        this.loginService.jumpToCourtesyPage();
      },
    });
    if (this.utente != null) {
      console.log(this.utente);
    } else {
      console.error('Utente NON loggato a sistema !');
    }

    this.profileService.getProfiloUtilizzato().subscribe({
      next: (response: Profilo) => {
        if (response) {
          this.profiloAttuale = response.descrizione
          sessionStorage.setItem("codProfilo",response.codice)
        }
      }
    })
  }
}
