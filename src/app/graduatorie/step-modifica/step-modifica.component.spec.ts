import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepModificaComponent } from './step-modifica.component';

describe('StepModificaComponent', () => {
  let component: StepModificaComponent;
  let fixture: ComponentFixture<StepModificaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepModificaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepModificaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
