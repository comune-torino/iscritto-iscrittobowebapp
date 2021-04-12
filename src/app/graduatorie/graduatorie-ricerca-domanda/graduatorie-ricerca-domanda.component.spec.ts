import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatorieRicercaDomandaComponent } from './graduatorie-ricerca-domanda.component';

describe('GraduatorieRicercaDomandaComponent', () => {
  let component: GraduatorieRicercaDomandaComponent;
  let fixture: ComponentFixture<GraduatorieRicercaDomandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduatorieRicercaDomandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatorieRicercaDomandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
