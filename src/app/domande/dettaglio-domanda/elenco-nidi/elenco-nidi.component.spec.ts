import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElencoNidiComponent } from './elenco-nidi.component';

describe('ElencoNidiComponent', () => {
  let component: ElencoNidiComponent;
  let fixture: ComponentFixture<ElencoNidiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElencoNidiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElencoNidiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
