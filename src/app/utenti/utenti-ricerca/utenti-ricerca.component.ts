import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-utenti-ricerca',
  templateUrl: './utenti-ricerca.component.html',
  styleUrls: ['./utenti-ricerca.component.css']
})
export class UtentiRicercaComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();
  }

}
