import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepInserisciComponent } from './step-inserisci.component';

describe('StepInserisciComponent', () => {
  let component: StepInserisciComponent;
  let fixture: ComponentFixture<StepInserisciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepInserisciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepInserisciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
