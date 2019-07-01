import { ManifestInterface } from '../dto/manifest.interface';
import { Container } from '../container';
import { NotFoundProviderDefinitionError } from '../errors/not-found-provider-definition.error';
import { RequiredAutoFactoryDefinitionError } from '../errors/required-autofactory-definition.error';

class TestServiceA {}
class TestServiceB {
  constructor(testServiceA) {
    // @ts-ignore
    this.testServiceA = testServiceA;
  }
}

describe('Inverse of Control: one module', function() {
  beforeEach(() => {
    const diManifest: ManifestInterface = {
      moduleName: 'tesModule',
      providers: [
        {
          isPublic: true,
          token: 'testServiceB',
          useClass: TestServiceB,
          dependencies: ['testServiceA'],
        },
        {
          token: 'testServiceA',
          useClass: TestServiceA,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([diManifest]);
    container.compile();
    this.container = container;
  });

  it('should not resolve private instance', () => {
    expect.assertions(1);
    try {
      this.container.get('tesModule', 'testServiceA');
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundProviderDefinitionError);
    }
  });

  it('should resolve instance', () => {
    const testServiceB = this.container.get('tesModule', 'testServiceB');
    expect(testServiceB).toBeInstanceOf(TestServiceB);
    expect(testServiceB.testServiceA).toBeInstanceOf(TestServiceA);
  });

  it('should resolve as factory', () => {
    let serviceInjectedToFactory = false;
    const diManifest: ManifestInterface = {
      moduleName: 'module',
      providers: [
        {
          isPublic: true,
          token: 'testServiceB',
          useFactory: testServiceA => {
            serviceInjectedToFactory = testServiceA instanceof TestServiceA;
            return 10;
          },
          dependencies: ['testServiceA'],
        },
        {
          token: 'testServiceA',
          useClass: TestServiceA,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([diManifest]);
    container.compile();
    expect(serviceInjectedToFactory).toBeTruthy();

    const testServiceB = container.get('module', 'testServiceB');
    expect(testServiceB).toEqual(10);
  });

  it('should resolve as autoFactory', () => {
    const diManifest: ManifestInterface = {
      moduleName: 'module',
      providers: [
        {
          isPublic: true,
          autoFactory: true,
          token: 'testServiceB',
          useClass: TestServiceA,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([diManifest]);
    container.compile();

    const factory = container.get('module', 'testServiceB');
    expect(new factory()).not.toBe(new factory());
    expect(new factory()).toBeInstanceOf(TestServiceA);
  });

  it('should resolve dependencies of autoFactory', () => {
    const diManifest: ManifestInterface = {
      moduleName: 'module',
      providers: [
        {
          isPublic: true,
          autoFactory: true,
          token: 'testServiceB',
          useClass: TestServiceB,
          dependencies: ['TestServiceA'],
        },
        {
          token: 'TestServiceA',
          useClass: TestServiceA,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([diManifest]);
    container.compile();

    const serviceFactory = container.get('module', 'testServiceB');
    const instance = new serviceFactory();

    expect(instance).toBeInstanceOf(TestServiceB);
    expect(instance.testServiceA).toBeInstanceOf(TestServiceA);
  });

  it('should throw error if use autoFactory in dependency and not define it', () => {
    expect.assertions(1);

    const diManifest: ManifestInterface = {
      moduleName: 'module',
      providers: [
        {
          isPublic: true,
          token: 'testServiceB',
          useClass: TestServiceB,
          dependencies: ['TestServiceA'],
        },
        {
          autoFactory: true,
          token: 'TestServiceA',
          useClass: TestServiceA,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([diManifest]);

    try {
      container.compile();
    } catch (e) {
      expect(e).toBeInstanceOf(RequiredAutoFactoryDefinitionError);
    }
  });

  it('should inject autoFactory as a dependency', () => {
    const diManifest: ManifestInterface = {
      moduleName: 'module',
      providers: [
        {
          isPublic: true,
          token: 'testServiceB',
          useClass: TestServiceB,
          dependencies: [['TestServiceA', { autoFactory: true }]],
        },
        {
          autoFactory: true,
          token: 'TestServiceA',
          useClass: TestServiceA,
        },
      ],
    };

    const container = new Container();
    container.loadManifests([diManifest]);
    container.compile();

    const serviceB = container.get('module', 'testServiceB');

    expect(serviceB).toBeInstanceOf(TestServiceB);
    expect(new serviceB.testServiceA()).toBeInstanceOf(TestServiceA);
  });
});
