import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatorieRicercaComponent } from './graduatorie-ricerca.component';

describe('GraduatorieRicercaComponent', () => {
  let component: GraduatorieRicercaComponent;
  let fixture: ComponentFixture<GraduatorieRicercaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduatorieRicercaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatorieRicercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
