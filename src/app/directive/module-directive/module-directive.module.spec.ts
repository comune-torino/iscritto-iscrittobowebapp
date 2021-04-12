import { ModuleDirectiveModule } from './module-directive.module';

describe('ModuleDirectiveModule', () => {
  let moduleDirectiveModule: ModuleDirectiveModule;

  beforeEach(() => {
    moduleDirectiveModule = new ModuleDirectiveModule();
  });

  it('should create an instance', () => {
    expect(moduleDirectiveModule).toBeTruthy();
  });
});
