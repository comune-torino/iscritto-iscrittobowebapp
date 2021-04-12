import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SrvError } from 'src/app/model/common/srv-error';
import { TestataDomandaDaVerificare } from 'src/app/model/common/testata-domanda';
import { AuthService } from 'src/app/service/auth.service';
import { DomandaService } from 'src/app/service/domanda.service';

@Component({
  selector: 'app-verifica-ammissibilita',
  templateUrl: './verifica-ammissibilita.component.html',
  styleUrls: ['./verifica-ammissibilita.component.css']
})
export class VerificaAmmissibilitaComponent implements OnInit {
  globalError: boolean = false;
  statusSearch: boolean = false;
  testataDomande: TestataDomandaDaVerificare[];

  constructor(
    private domandaService: DomandaService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();

    this.statusSearch = true;
    console.log('init componente .. ');
    const ordineScuola: string = sessionStorage.getItem('ordineScuola');
    this.domandaService.getDomandeDaVerificare(ordineScuola).subscribe({
      next: (response: Array<TestataDomandaDaVerificare>) => {
        this.testataDomande = response;
        console.log('RicercaDomande, domande trovate: ' + this.testataDomande.length);
        this.statusSearch = false;
      },
      error: (response: SrvError) => {
        console.log('Errore: ' + JSON.stringify(response));
        this.statusSearch = false;
        this.globalError = true;
        setTimeout(() => {
          this.globalError = false;
        }, 9000);
      },
    })
  }

}
