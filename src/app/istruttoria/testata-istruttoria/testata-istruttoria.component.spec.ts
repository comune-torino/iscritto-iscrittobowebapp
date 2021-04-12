import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestataIstruttoriaComponent } from './testata-istruttoria.component';

describe('TestataIstruttoriaComponent', () => {
  let component: TestataIstruttoriaComponent;
  let fixture: ComponentFixture<TestataIstruttoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestataIstruttoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestataIstruttoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
