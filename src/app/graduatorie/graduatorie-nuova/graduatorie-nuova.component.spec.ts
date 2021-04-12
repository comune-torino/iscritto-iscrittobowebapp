import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatorieNuovaComponent } from './graduatorie-nuova.component';

describe('GraduatorieNuovaComponent', () => {
  let component: GraduatorieNuovaComponent;
  let fixture: ComponentFixture<GraduatorieNuovaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduatorieNuovaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatorieNuovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
