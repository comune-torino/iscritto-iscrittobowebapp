import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtesyPageComponent } from './courtesy-page.component';

describe('CourtesyPageComponent', () => {
  let component: CourtesyPageComponent;
  let fixture: ComponentFixture<CourtesyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourtesyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourtesyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
