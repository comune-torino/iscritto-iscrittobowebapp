import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificaAmmissibilitaComponent } from './verifica-ammissibilita.component';

describe('VerificaAmmissibilitaComponent', () => {
  let component: VerificaAmmissibilitaComponent;
  let fixture: ComponentFixture<VerificaAmmissibilitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificaAmmissibilitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificaAmmissibilitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
