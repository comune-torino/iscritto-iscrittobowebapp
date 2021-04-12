import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestataDomandeAmmissibilitaComponent } from './testata-domande-ammissibilita.component';

describe('TestataDomandeAmmissibilitaComponent', () => {
  let component: TestataDomandeAmmissibilitaComponent;
  let fixture: ComponentFixture<TestataDomandeAmmissibilitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestataDomandeAmmissibilitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestataDomandeAmmissibilitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
