import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaAnagraficaComponent } from './eta-anagrafica.component';

describe('EtaAnagraficaComponent', () => {
  let component: EtaAnagraficaComponent;
  let fixture: ComponentFixture<EtaAnagraficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtaAnagraficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtaAnagraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
