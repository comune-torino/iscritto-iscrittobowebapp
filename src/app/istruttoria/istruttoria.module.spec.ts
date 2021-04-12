import { IstruttoriaModule } from './istruttoria.module';

describe('IstruttoriaModule', () => {
  let istruttoriaModule: IstruttoriaModule;

  beforeEach(() => {
    istruttoriaModule = new IstruttoriaModule();
  });

  it('should create an instance', () => {
    expect(istruttoriaModule).toBeTruthy();
  });
});
