import { InstanceWrapperFactoryInterface } from './instance-wrapper-factory.interface';
import { ManifestInterface } from './dto/manifest.interface';
import { ProviderInterface } from './dto/provider.interface';
import { TokenAlreadyUsedError } from './errors/token-already-used.error';
import {
  InstanceWrapperInterface,
  ModuleInterface,
  Token,
} from './internal-types';

export class Module implements ModuleInterface {
  private readonly instanceWrapperFactory: InstanceWrapperFactoryInterface;

  private readonly providers: Map<Token, InstanceWrapperInterface>;

  public readonly name: string;

  public constructor(
    instanceWrapperFactory: InstanceWrapperFactoryInterface,
    manifest: ManifestInterface,
  ) {
    this.instanceWrapperFactory = instanceWrapperFactory;
    this.providers = new Map();

    this.name = manifest.moduleName;
    manifest.providers.forEach(provider => {
      this.addProvider(provider);
    });
  }

  private addProvider(provider: ProviderInterface) {
    if (this.providers.has(provider.token)) {
      throw new TokenAlreadyUsedError().combine({
        token: provider.token,
        module: this.name,
      });
    }

    const instanceWrapper = this.instanceWrapperFactory.create(provider, this);
    this.providers.set(provider.token, instanceWrapper);
  }

  // @TODO: Реализовать позже
  public override() {}

  public getPublicProviders(): InstanceWrapperInterface[] {
    return [...this.providers.values()].filter(provider => provider.isPublic);
  }

  public getProviders(): InstanceWrapperInterface[] {
    return [...this.providers.values()];
  }

  public getProviderByToken(token: Token): InstanceWrapperInterface {
    return this.providers.get(token);
  }

  public has(token: Token): boolean {
    return this.providers.has(token);
  }
}
