import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CondizioneOccupazionaleComponent } from './condizione-occupazionale.component';

describe('CondizioneOccupazionaleComponent', () => {
  let component: CondizioneOccupazionaleComponent;
  let fixture: ComponentFixture<CondizioneOccupazionaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CondizioneOccupazionaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CondizioneOccupazionaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
