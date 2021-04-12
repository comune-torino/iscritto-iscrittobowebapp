import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioDomandaSuccessiveComponent } from './dettaglio-domanda-successive.component';

describe('DettaglioDomandaSuccessiveComponent', () => {
  let component: DettaglioDomandaSuccessiveComponent;
  let fixture: ComponentFixture<DettaglioDomandaSuccessiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioDomandaSuccessiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioDomandaSuccessiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
