import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfo } from 'src/app/model/common/user-info';
import { SrvError } from '../model/common/srv-error';
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root',
  useFactory: 'loadData'
})
export class LoginService {
  utenteLoggato: UserInfo;
  openMenu: string;

  constructor(
    private router: Router,
    private config: ConfigService,
    private http: HttpClient
  ) { }

  SSOLogout(): void {
    // local logout
    console.log('Reset sessione applicativa lato server ..');
    this.http.get<UserInfo>(this.config.getBEServer() + '/autorizzazione/localLogout');
    console.log('sessione applicativa resettata');
    // SSO logout
    this.router.navigate(['/']).then(
      result => {
        window.location.href = this.config.getSSOLogoutURL();
      }
    );
  }

  localLogout(): void {
    // reset server session
    console.log('Reset sessione applicativa lato server ..');
    this.http.get<UserInfo>(this.config.getBEServer() + '/autorizzazione/localLogout');
    console.log('sessione applicativa resettata');

    // exit from application
    console.log('Uscita applicativa =>  this.config.getOnAppExitURL()');
    this.router.navigate(['/']).then(
      result => {
        window.location.href = this.config.getOnAppExitURL();
      }
    );
  }

  // getter sulla proprietà con le info dell'utente loggato
  getUtenteLoggato(): Observable<UserInfo | SrvError> {
    return this.http.get<UserInfo>(this.config.getBEServer() + '/autorizzazione/currentUser');
  }

  /**
   *
   * @param url permette di saltare alla url esterna di compilazione conto terzi (FO)
   */
  public jumpToURLContoTerzi(url: string) {
    console.log('redirecting to FO-Conto terzi ' + url + '...');
    this.router.navigate(['/']).then(result => {
      window.location.href = url;
    });
  }

  public jumpToURL(url: string) {
    console.log('redirecting to FO-Conto terzi ' + url + '...');
    // this.location.go(url);
    this.router.navigate(['/']).then(result => {
      window.location.href = url;
    });
  }

  /**
   * permette di visualizzare una pagina di cortesia
   */
  public jumpToCourtesyPage() {
    console.log('redirecting to courtesy page...');
    this.router.navigate(['courtesypage']);
  }

  public getOpenMenu(): string {
    return this.openMenu;
  }

  public setOpenMenu(actualMenu: string) {
    this.openMenu = actualMenu;
  }

}
