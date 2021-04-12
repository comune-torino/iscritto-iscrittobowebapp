import { UtentiModule } from './utenti.module';

describe('UtentiModule', () => {
  let utentiModule: UtentiModule;

  beforeEach(() => {
    utentiModule = new UtentiModule();
  });

  it('should create an instance', () => {
    expect(utentiModule).toBeTruthy();
  });
});
