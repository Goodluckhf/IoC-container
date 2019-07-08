import 'reflect-metadata';
import { TestIoCContainer } from '../test-ioc-container';
import { ManifestInterface } from '../dto/manifest.interface';

class ServiceA {}

describe('TestContainer', () => {
  it.skip('should override providers', () => {
    const diManifest: ManifestInterface = {
      moduleName: 'module',
      providers: [
        {
          isPublic: true,
          token: 'ServiceA',
          useClass: ServiceA,
        },
      ],
    };

    const testContainerAdapter = new TestIoCContainer([diManifest]);
    // @ts-ignore
    testContainerAdapter.override([
      { token: 'ServiceA', useValue: 10, isPublic: true },
    ]);
    testContainerAdapter.compile();

    const serviceA = testContainerAdapter.get('ServiceA');
    expect(serviceA).toEqual(10);
  });

  it('can get provider without module', () => {
    const testContainer = TestIoCContainer.createTestModule([
      { isPublic: true, token: 'testToken', useValue: 10 },
    ]);

    testContainer.compile();
    expect(testContainer.get('testToken')).toBe(10);
  });
});
