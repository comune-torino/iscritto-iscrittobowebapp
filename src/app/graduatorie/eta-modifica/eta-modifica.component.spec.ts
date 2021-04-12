import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaModificaComponent } from './eta-modifica.component';

describe('EtaModificaComponent', () => {
  let component: EtaModificaComponent;
  let fixture: ComponentFixture<EtaModificaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtaModificaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtaModificaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
