import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtentiMenuComponent } from './utenti-menu.component';

describe('UtentiMenuComponent', () => {
  let component: UtentiMenuComponent;
  let fixture: ComponentFixture<UtentiMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtentiMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtentiMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
