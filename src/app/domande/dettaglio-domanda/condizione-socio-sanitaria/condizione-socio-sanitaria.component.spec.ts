import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondizioneSocioSanitariaComponent } from './condizione-socio-sanitaria.component';

describe('CondizioneSocioSanitariaComponent', () => {
  let component: CondizioneSocioSanitariaComponent;
  let fixture: ComponentFixture<CondizioneSocioSanitariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondizioneSocioSanitariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondizioneSocioSanitariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
