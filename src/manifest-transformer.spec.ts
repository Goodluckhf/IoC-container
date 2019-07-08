import 'reflect-metadata';
import { ManifestTransformer } from './manifest-transformer';
import { ManifestInterface } from './public-interfaces/manifest.interface';
import { ManifestTransformerInterface } from './manifest-transformer.interface';
import { ValidationError } from './errors/validation.error';

class A {}
describe('ManifestTransformer', () => {
  let correctManifest: ManifestInterface;

  let manifestTransformer: ManifestTransformerInterface;

  beforeEach(() => {
    manifestTransformer = new ManifestTransformer();
    correctManifest = {
      moduleName: 'testModule',
      providers: [
        { token: 'testToken', useClass: A },
        { token: 'testTokenB', useFactory: () => {}, isPublic: true },
        { token: 'testTokenE', useValue: 10 },
        { token: 'testTokenC', useClass: A, dependencies: ['testTokenB'] },
        {
          token: 'testTokenD',
          useClass: A,
          dependencies: [['testTokenB', { fromModule: 'ModuleB' }]],
        },
        {
          token: 'testTokenD',
          useFactory: () => {},
          dependencies: [
            ['testTokenB', { fromModule: 'ModuleB', autoFactory: true }],
          ],
        },
      ],
    };
  });

  it('should throw error if moduleName is not provided', () => {
    expect.assertions(1);
    delete correctManifest.moduleName;
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw error if there is no providers', () => {
    expect.assertions(1);
    delete correctManifest.providers;
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw error if there is no token in provider', () => {
    expect.assertions(1);
    delete correctManifest.providers[0].token;
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw error if isPublic not boolean', () => {
    expect.assertions(1);
    // @ts-ignore
    correctManifest.providers[0].isPublic = 'test';
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw error if autoFactory not boolean', () => {
    expect.assertions(1);
    // @ts-ignore
    correctManifest.providers[0].autoFactory = 'test';
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw error if token is not string in simple dependency', () => {
    expect.assertions(1);
    // @ts-ignore
    correctManifest.providers[3].dependencies[0] = 10;
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw error if token is not string in custom dependency', () => {
    expect.assertions(1);
    // @ts-ignore
    correctManifest.providers[4].dependencies[0] = {};
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should throw error if non of useClass, useValue, useFactory provided', () => {
    expect.assertions(1);
    // @ts-ignore
    delete correctManifest.providers[0].useClass;
    try {
      manifestTransformer.transform([correctManifest]);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });

  it('should not throw validation error', () => {
    manifestTransformer.transform([correctManifest]);
  });
});
