import 'reflect-metadata';
import { Module } from './module';
import { TokenAlreadyUsedError } from './errors/token-already-used.error';

describe('Module', () => {
  it('should throw error if this token used in context of this module', () => {
    expect.assertions(1);
    const diManifest = {
      moduleName: 'tesModule',
      providers: [
        {
          token: 'ServiceA',
          useValue: 10,
        },
        {
          token: 'ServiceA',
          useValue: 10,
        },
      ],
    };
    try {
      new Module(
        {
          // @ts-ignore
          create(value) {
            return value;
          },
        },
        diManifest,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(TokenAlreadyUsedError);
    }
  });

  it('should get public providers', () => {
    const diManifest = {
      moduleName: 'tesModule',
      providers: [
        {
          isPublic: true,
          token: 'ServiceA',
          useValue: 10,
        },
        {
          token: 'ServiceB',
          useValue: 11,
        },
      ],
    };

    const newModule = new Module(
      {
        // @ts-ignore
        create(value) {
          return value;
        },
      },
      diManifest,
    );

    const publicProviders = newModule.getPublicProviders();
    const publicProvider = publicProviders.find(
      object => object.token === 'ServiceA',
    );
    expect(publicProviders.length).toEqual(1);
    expect(publicProvider).not.toBeNull();
  });
});
