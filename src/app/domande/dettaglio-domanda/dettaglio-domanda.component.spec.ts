import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioDomandaComponent } from './dettaglio-domanda.component';

describe('DettaglioDomandaComponent', () => {
  let component: DettaglioDomandaComponent;
  let fixture: ComponentFixture<DettaglioDomandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioDomandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioDomandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
