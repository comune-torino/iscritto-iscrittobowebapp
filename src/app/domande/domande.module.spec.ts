import { DomandeModule } from './domande.module';

describe('DomandeModule', () => {
  let domandeModule: DomandeModule;

  beforeEach(() => {
    domandeModule = new DomandeModule();
  });

  it('should create an instance', () => {
    expect(domandeModule).toBeTruthy();
  });
});
