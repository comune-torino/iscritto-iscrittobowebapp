import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenzeScuolaModificaComponent } from './preferenze-scuola-modifica.component';

describe('PreferenzeScuolaModificaComponent', () => {
  let component: PreferenzeScuolaModificaComponent;
  let fixture: ComponentFixture<PreferenzeScuolaModificaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenzeScuolaModificaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenzeScuolaModificaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
