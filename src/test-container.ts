import { Container } from './container';
import { ProviderInterface } from './dto/provider.interface';
import { Token } from './internal-types';

const testModuleName = 'testModule';

class TestContainer {
  private container: Container;

  public constructor(manifests) {
    this.container = new Container();
    this.container.loadManifests(manifests);
  }

  // @TODO: Implements
  public override() {}

  public compile() {
    this.container.compile();
  }

  public get(token: Token) {
    return this.container.get(testModuleName, token);
  }

  public static createTestModule(providers: ProviderInterface[]) {
    return new this([
      {
        moduleName: testModuleName,
        providers,
      },
    ]);
  }
}

export { TestContainer };
