import { TestContainer } from '../test-container';
import { ManifestInterface } from '../manifest.interface';

class ServiceA {}

describe.skip('TestContainer', () => {
  it('should override providers', () => {
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

    const testContainerAdapter = new TestContainer([diManifest]);
    // @ts-ignore
    testContainerAdapter.override([
      { token: 'ServiceA', useValue: 10, isPublic: true },
    ]);
    testContainerAdapter.compile();

    const serviceA = testContainerAdapter.get('ServiceA');
    expect(serviceA).toEqual(10);
  });
});
