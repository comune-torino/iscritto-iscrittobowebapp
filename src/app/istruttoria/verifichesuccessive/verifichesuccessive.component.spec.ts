import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifichesuccessiveComponent } from './verifichesuccessive.component';

describe('VerifichesuccessiveComponent', () => {
  let component: VerifichesuccessiveComponent;
  let fixture: ComponentFixture<VerifichesuccessiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifichesuccessiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifichesuccessiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
