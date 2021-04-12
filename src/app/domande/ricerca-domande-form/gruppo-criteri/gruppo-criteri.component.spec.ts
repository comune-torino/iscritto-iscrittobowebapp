import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruppoCriteriComponent } from './gruppo-criteri.component';

describe('GruppoCriteriComponent', () => {
  let component: GruppoCriteriComponent;
  let fixture: ComponentFixture<GruppoCriteriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruppoCriteriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruppoCriteriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
