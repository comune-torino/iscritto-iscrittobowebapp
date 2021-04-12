import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtaInserisciComponent } from './eta-inserisci.component';

describe('EtaInserisciComponent', () => {
  let component: EtaInserisciComponent;
  let fixture: ComponentFixture<EtaInserisciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtaInserisciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtaInserisciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
