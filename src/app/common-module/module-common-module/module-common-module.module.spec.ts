import { ModuleCommonModuleModule } from './module-common-module.module';

describe('ModuleCommonModuleModule', () => {
  let moduleCommonModuleModule: ModuleCommonModuleModule;

  beforeEach(() => {
    moduleCommonModuleModule = new ModuleCommonModuleModule();
  });

  it('should create an instance', () => {
    expect(moduleCommonModuleModule).toBeTruthy();
  });
});
