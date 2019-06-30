import { Container } from './container';
import { Module } from './module';
import { AlreadyCompiledError } from './errors/already-compiled.error';

class TestServiceA {}
class TestServiceB {
  constructor(testServiceA) {
    // @ts-ignore
    this.testServiceA = testServiceA;
  }
}

describe('IoC container', () => {
  it('should parse manifest to module', () => {
    const container = new Container();
    const diManifest = {
      moduleName: 'tesModule',
      providers: [
        {
          token: 'testServiceA',
          useClass: TestServiceA,
        },
      ],
    };

    container.loadManifests([diManifest]);
    // @ts-ignore
    expect(container.modules.size).toEqual(1);
    // @ts-ignore
    expect([...container.modules.values()][0]).toBeInstanceOf(Module);
  });

  it('Should throw error if has already compiled', () => {
    const container = new Container();
    const diManifest = {
      moduleName: 'tesModule',
      providers: [
        {
          token: 'testServiceA',
          useClass: TestServiceA,
        },
      ],
    };
    container.loadManifests([diManifest]);
    container.compile();
    expect(() => {
      container.compile();
    }).toThrow(AlreadyCompiledError);
  });
});
