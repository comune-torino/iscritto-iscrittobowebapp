import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtentiNuovoComponent } from './utenti-nuovo.component';

describe('UtentiNuovoComponent', () => {
  let component: UtentiNuovoComponent;
  let fixture: ComponentFixture<UtentiNuovoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtentiNuovoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtentiNuovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
