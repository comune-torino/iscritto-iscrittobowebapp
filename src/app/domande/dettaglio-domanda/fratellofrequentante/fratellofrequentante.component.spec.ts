import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FratellofrequentanteComponent } from './fratellofrequentante.component';

describe('FratellofrequentanteComponent', () => {
  let component: FratellofrequentanteComponent;
  let fixture: ComponentFixture<FratellofrequentanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FratellofrequentanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FratellofrequentanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
