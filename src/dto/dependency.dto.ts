import { buildPublicToken } from '../helpers';
import { DependencyInterface, DependencyType, Token } from '../internal-types';

export class DependencyDto implements DependencyInterface {
  public readonly token: Token;

  public readonly fromModule: string;

  public readonly autoFactory: boolean;

  public constructor(config: DependencyType) {
    if (Array.isArray(config)) {
      const [token, dependencyOptions] = config;
      this.token = token;
      this.autoFactory = dependencyOptions && dependencyOptions.autoFactory;
      this.fromModule = dependencyOptions && dependencyOptions.fromModule;
      if (this.fromModule) {
        this.token = buildPublicToken(this.fromModule, this.token);
      }
    } else {
      this.token = config;
      this.fromModule = null;
      this.autoFactory = false;
    }
  }
}
