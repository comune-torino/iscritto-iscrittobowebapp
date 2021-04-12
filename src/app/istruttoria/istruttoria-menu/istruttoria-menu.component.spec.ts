import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IstruttoriaMenuComponent } from './istruttoria-menu.component';

describe('IstruttoriaMenuComponent', () => {
  let component: IstruttoriaMenuComponent;
  let fixture: ComponentFixture<IstruttoriaMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IstruttoriaMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IstruttoriaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
