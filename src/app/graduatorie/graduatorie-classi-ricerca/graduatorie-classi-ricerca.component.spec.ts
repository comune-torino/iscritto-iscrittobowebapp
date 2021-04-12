import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatorieClassiRicercaComponent } from './graduatorie-classi-ricerca.component';

describe('GraduatorieClassiRicercaComponent', () => {
  let component: GraduatorieClassiRicercaComponent;
  let fixture: ComponentFixture<GraduatorieClassiRicercaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduatorieClassiRicercaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatorieClassiRicercaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
