import { GraduatorieModule } from './graduatorie.module';

describe('GraduatorieModule', () => {
  let graduatorieModule: GraduatorieModule;

  beforeEach(() => {
    graduatorieModule = new GraduatorieModule();
  });

  it('should create an instance', () => {
    expect(graduatorieModule).toBeTruthy();
  });
});
