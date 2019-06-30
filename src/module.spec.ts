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
});
