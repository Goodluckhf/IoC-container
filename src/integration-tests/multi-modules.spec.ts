import { Container } from '..';
import { NotFoundProviderDefinitionError } from '../errors/not-found-provider-definition.error';
import { ModuleHasAlreadyExists } from '../errors/module-has-already-exists.error';
import { ManifestInterface } from '../public-interfaces/manifest.interface';
import { CircularDependencyError } from '../errors/circular-dependency.error';

// Module A
class ServiceA {}
class ServiceB {
  constructor(testServiceA) {
    // @ts-ignore
    this.testServiceA = testServiceA;
  }
}

// Module B
class ServiceC {
  constructor(constant, testServiceA) {
    // @ts-ignore
    this.constant = constant;
    // @ts-ignore
    this.testServiceA = testServiceA;
  }
}

describe('Inverse of Control: multi modules', function() {
  it('should throw error when try to use private dependency from another module', () => {
    expect.assertions(1);
    const moduleAManifest: ManifestInterface = {
      moduleName: 'moduleA',
      providers: [
        {
          token: 'ServiceA',
          useClass: ServiceA,
        },
      ],
    };

    const moduleBManifest: ManifestInterface = {
      moduleName: 'moduleB',
      providers: [
        {
          isPublic: true,
          token: 'ServiceC',
          useClass: ServiceC,
          dependencies: [
            ['ServiceA', { fromModule: 'moduleA', autoFactory: false }],
            'constantToken',
          ],
        },
        {
          token: 'constantToken',
          useValue: 10,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([moduleAManifest, moduleBManifest]);

    try {
      container.compile();
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundProviderDefinitionError);
    }
  });

  it('should resolve public dependency from another module', () => {
    const moduleAManifest: ManifestInterface = {
      moduleName: 'moduleA',
      providers: [
        {
          isPublic: true,
          token: 'ServiceA',
          useClass: ServiceA,
        },
      ],
    };

    const moduleBManifest: ManifestInterface = {
      moduleName: 'moduleB',
      providers: [
        {
          isPublic: true,
          token: 'ServiceC',
          useClass: ServiceC,
          dependencies: [
            'constantToken',
            ['ServiceA', { fromModule: 'moduleA' }],
          ],
        },
        {
          token: 'constantToken',
          useValue: 10,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([moduleAManifest, moduleBManifest]);

    container.compile();
    const serviceC = container.get('moduleB', 'ServiceC');
    expect(serviceC).toBeInstanceOf(ServiceC);
    expect(serviceC.constant).toEqual(10);
    expect(serviceC.testServiceA).toBeInstanceOf(ServiceA);
  });

  it('should throw error if try to define more than 1 module with the same name', () => {
    expect.assertions(1);

    const manifestA: ManifestInterface = {
      moduleName: 'moduleA',
      providers: [
        {
          isPublic: true,
          token: 'ServiceA',
          useClass: ServiceA,
        },
      ],
    };

    const manifestB: ManifestInterface = {
      moduleName: 'moduleA',
      providers: [
        {
          isPublic: true,
          token: 'ServiceA',
          useClass: ServiceA,
        },
      ],
    };

    const container = new Container();
    try {
      container.loadManifests([manifestA, manifestB]);
      container.compile();
    } catch (e) {
      expect(e).toBeInstanceOf(ModuleHasAlreadyExists);
    }
  });

  it('should provide arguments to autoFactory', () => {
    class FactoryService {
      constructor(serviceA, arg1, arg2) {
        // @ts-ignore
        this.serviceA = serviceA;
        // @ts-ignore
        this.arg1 = arg1;
        // @ts-ignore
        this.arg2 = arg2;
      }
    }

    const manifestA: ManifestInterface = {
      moduleName: 'moduleA',
      providers: [
        {
          token: 'ServiceA',
          useClass: ServiceA,
        },
        {
          isPublic: true,
          autoFactory: true,
          token: 'FactoryService',
          useClass: FactoryService,
          dependencies: ['ServiceA'],
        },
      ],
    };

    const container = new Container();
    container.loadManifests([manifestA]);
    container.compile();

    const FactoryServiceClass = container.get('moduleA', 'FactoryService');
    const instanceOfService = new FactoryServiceClass(10, false);
    expect(instanceOfService).toBeInstanceOf(FactoryService);
    expect(instanceOfService.arg1).toEqual(10);
    expect(instanceOfService.arg2).toEqual(false);
    expect(instanceOfService.serviceA).toBeInstanceOf(ServiceA);
  });

  it('should throw circular dependency error with long chain', () => {
    expect.assertions(1);
    const container = new Container();
    const diManifestA: ManifestInterface = {
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

    const diManifestB: ManifestInterface = {
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

    container.loadManifests([diManifestA, diManifestB]);
    try {
      container.compile();
    } catch (e) {
      expect(e).toBeInstanceOf(CircularDependencyError);
    }
  });
});
