import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestataDomandeComponent } from './testata-domande.component';

describe('TestataDomandeComponent', () => {
  let component: TestataDomandeComponent;
  let fixture: ComponentFixture<TestataDomandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestataDomandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestataDomandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
