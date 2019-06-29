import { Container } from './container';
import { CircularDependencyError } from './errors/circular-dependency.error';

class ServiceA {}
class ServiceB {}
class ServiceC {}

describe('Injector', () => {
  it('should throw circular dependency', () => {
    expect.assertions(1);

    const container = new Container();
    const diManifest = {
      moduleName: 'tesModule',
      providers: [
        {
          token: 'ServiceA',
          useClass: ServiceA,
          dependencies: ['ServiceB'],
        },
        {
          token: 'ServiceB',
          useClass: ServiceB,
          dependencies: ['ServiceA'],
        },
      ],
    };

    container.loadManifests([diManifest]);
    try {
      container.compile();
    } catch (e) {
      expect(e).toBeInstanceOf(CircularDependencyError);
    }
  });

  it('should throw circular dependency error with long chain', () => {
    expect.assertions(1);
    const container = new Container();
    const diManifestA = {
      moduleName: 'ModuleA',
      providers: [
        {
          isPublic: true,
          token: 'ServiceC',
          useClass: ServiceC,
          dependencies: [['ServiceA', { fromModule: 'ModuleB' }]],
        },
      ],
    };

    const diManifestB = {
      moduleName: 'ModuleB',
      providers: [
        {
          isPublic: true,
          token: 'ServiceA',
          useClass: ServiceA,
          dependencies: ['ServiceB'],
        },
        {
          token: 'ServiceB',
          useClass: ServiceB,
          dependencies: [['ServiceC', { fromModule: 'ModuleA' }]],
        },
      ],
    };

    // @ts-ignore
    container.loadManifests([diManifestA, diManifestB]);
    try {
      container.compile();
    } catch (e) {
      expect(e).toBeInstanceOf(CircularDependencyError);
    }
  });
});
