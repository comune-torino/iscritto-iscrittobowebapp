import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-graduatorie-stato-domanda',
  templateUrl: './graduatorie-stato-domanda.component.html',
  styleUrls: ['./graduatorie-stato-domanda.component.css']
})
export class GraduatorieStatoDomandaComponent implements OnInit {
  statusSearch: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.checkOperatoreAbilitato();
  }

  onSelectDomanda(idDomanda: number): void {

  }

  onRicercaClose(): void {
    this.router.navigate(['/graduatorie/GRA']);
  }

}