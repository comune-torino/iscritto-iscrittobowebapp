import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoAnagraficaComponent } from './inserimento-anagrafica.component';

describe('InserimentoAnagraficaComponent', () => {
  let component: InserimentoAnagraficaComponent;
  let fixture: ComponentFixture<InserimentoAnagraficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserimentoAnagraficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserimentoAnagraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
