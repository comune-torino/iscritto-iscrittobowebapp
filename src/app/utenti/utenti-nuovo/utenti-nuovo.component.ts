import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-utenti-nuovo',
  templateUrl: './utenti-nuovo.component.html',
  styleUrls: ['./utenti-nuovo.component.css']
})
export class UtentiNuovoComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();
  }

}
