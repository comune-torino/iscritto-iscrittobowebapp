import { TestBed } from '@angular/core/testing';

import { IstruttoriaService } from './istruttoria.service';

describe('IstruttoriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IstruttoriaService = TestBed.get(IstruttoriaService);
    expect(service).toBeTruthy();
  });
});
