import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissioneHComponent } from './commissione-h.component';

describe('CommissioneHComponent', () => {
  let component: CommissioneHComponent;
  let fixture: ComponentFixture<CommissioneHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommissioneHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissioneHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
