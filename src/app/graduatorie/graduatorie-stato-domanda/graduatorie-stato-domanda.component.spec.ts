import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduatorieStatoDomandaComponent } from './graduatorie-stato-domanda.component';

describe('GraduatorieStatoDomandaComponent', () => {
  let component: GraduatorieStatoDomandaComponent;
  let fixture: ComponentFixture<GraduatorieStatoDomandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraduatorieStatoDomandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduatorieStatoDomandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
