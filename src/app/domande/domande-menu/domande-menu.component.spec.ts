import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomandeMenuComponent } from './domande-menu.component';

describe('DomandeMenuComponent', () => {
  let component: DomandeMenuComponent;
  let fixture: ComponentFixture<DomandeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomandeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomandeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
