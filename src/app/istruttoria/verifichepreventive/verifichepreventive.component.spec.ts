import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifichepreventiveComponent } from './verifichepreventive.component';

describe('VerifichepreventiveComponent', () => {
  let component: VerifichepreventiveComponent;
  let fixture: ComponentFixture<VerifichepreventiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifichepreventiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifichepreventiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
