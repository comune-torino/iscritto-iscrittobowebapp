import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioDomandaPreventiveComponent } from './dettaglio-domanda-preventive.component';

describe('DettaglioDomandaPreventiveComponent', () => {
  let component: DettaglioDomandaPreventiveComponent;
  let fixture: ComponentFixture<DettaglioDomandaPreventiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioDomandaPreventiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioDomandaPreventiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
