import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtentiRicercaComponent } from './utenti-ricerca.component';

describe('UtentiRicercaComponent', () => {
  let component: UtentiRicercaComponent;
  let fixture: ComponentFixture<UtentiRicercaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtentiRicercaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtentiRicercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
