import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RicercaDomandeFormComponent } from './ricerca-domande-form.component';

describe('RicercaDomandeFormComponent', () => {
  let component: RicercaDomandeFormComponent;
  let fixture: ComponentFixture<RicercaDomandeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RicercaDomandeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RicercaDomandeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
