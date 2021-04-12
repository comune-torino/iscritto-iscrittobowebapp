import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepAnagraficaComponent } from './step-anagrafica.component';

describe('StepAnagraficaComponent', () => {
  let component: StepAnagraficaComponent;
  let fixture: ComponentFixture<StepAnagraficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepAnagraficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepAnagraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
