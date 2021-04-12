import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IstruttoriaGestioneComponent } from './istruttoria-gestione.component';

describe('IstruttoriaGestioneComponent', () => {
  let component: IstruttoriaGestioneComponent;
  let fixture: ComponentFixture<IstruttoriaGestioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IstruttoriaGestioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IstruttoriaGestioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
