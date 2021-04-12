import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatorieReportComponent } from './graduatorie-report.component';

describe('GraduatorieReportComponent', () => {
  let component: GraduatorieReportComponent;
  let fixture: ComponentFixture<GraduatorieReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduatorieReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatorieReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
