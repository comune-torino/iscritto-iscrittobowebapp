import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenzeScuolaComponent } from "./preferenze-scuola.component";

describe('PreferenzeScuolaComponent', () => {
  let component: PreferenzeScuolaComponent;
  let fixture: ComponentFixture<PreferenzeScuolaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenzeScuolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenzeScuolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
