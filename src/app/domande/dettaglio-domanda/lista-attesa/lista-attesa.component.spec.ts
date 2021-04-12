import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAttesaComponent } from './lista-attesa.component';

describe('ListaAttesaComponent', () => {
  let component: ListaAttesaComponent;
  let fixture: ComponentFixture<ListaAttesaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaAttesaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAttesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
