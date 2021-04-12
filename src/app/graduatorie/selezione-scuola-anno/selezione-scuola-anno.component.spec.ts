import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezioneScuolaAnnoComponent } from './selezione-scuola-anno.component';

describe('SelezioneScuolaAnnoComponent', () => {
  let component: SelezioneScuolaAnnoComponent;
  let fixture: ComponentFixture<SelezioneScuolaAnnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelezioneScuolaAnnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezioneScuolaAnnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
