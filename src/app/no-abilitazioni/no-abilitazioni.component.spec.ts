import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAbilitazioniComponent } from './no-abilitazioni.component';

describe('NoAbilitazioniComponent', () => {
  let component: NoAbilitazioniComponent;
  let fixture: ComponentFixture<NoAbilitazioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoAbilitazioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAbilitazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
