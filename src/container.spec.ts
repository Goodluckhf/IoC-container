import { Container } from './container';
import { AlreadyCompiledError } from './errors/already-compiled.error';

describe('IoC container', function() {
  beforeEach(() => {
    // @ts-ignore
    this.container = new Container({}, {});
  });

  it('Should throw error if has already compiled', () => {
    expect.assertions(1);
    this.container.applyPublicProviders = () => {};
    this.container.compile();
    try {
      this.container.compile();
    } catch (e) {
      expect(e).toBeInstanceOf(AlreadyCompiledError);
    }
  });
});
