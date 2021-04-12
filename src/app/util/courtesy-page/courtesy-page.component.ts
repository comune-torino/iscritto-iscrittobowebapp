import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../service/login.service';
import {DomandaService} from '../../service/domanda.service';
import {UserInfo} from 'src/app/model/common/user-info';
import {SrvError} from '../../model/common/srv-error';

@Component({
  selector: 'app-courtesy-page',
  templateUrl: './courtesy-page.component.html',
  styleUrls: ['./courtesy-page.component.css']
})
export class CourtesyPageComponent implements OnInit {

  utenteLoggato: UserInfo;
  constructor( private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.getUtenteLoggato()
      .subscribe({
      next: (data: UserInfo) => {
        this.utenteLoggato = data;
      },
      error: (data: SrvError) => {
        console.log('Errore: ' + JSON.stringify(data));
        },
    });
  }
}
