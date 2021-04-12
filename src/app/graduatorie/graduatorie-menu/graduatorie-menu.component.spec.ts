import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatorieMenuComponent } from './graduatorie-menu.component';

describe('GraduatorieMenuComponent', () => {
  let component: GraduatorieMenuComponent;
  let fixture: ComponentFixture<GraduatorieMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduatorieMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatorieMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
