import { ContainerInterface } from './container.interface';
import { ManifestInterface } from './dto/manifest.interface';
import { buildPublicToken } from './helpers';
import { Module } from './module';
import { Injector } from './injector';
import { ModuleHasAlreadyExists } from './errors/module-has-already-exists.error';
import { AlreadyCompiledError } from './errors/already-compiled.error';
import { NotCompiledError } from './errors/not-compiled.error';
import { NotFoundProviderDefinitionError } from './errors/not-found-provider-definition.error';
import {
  InstanceWrapperInterface,
  ModuleInterface,
  Token,
} from './internal-types';
import { InstanceWrapperFactoryInterface } from './instance-wrapper-factory.interface';
import { ConfigParserInterface } from './config-parser.interface';

export class Container implements ContainerInterface {
  private readonly instanceWrapperFactory: InstanceWrapperFactoryInterface;

  private readonly configParser: ConfigParserInterface;

  private readonly publicProviders: Map<Token, InstanceWrapperInterface>;

  private readonly modules: Map<string, ModuleInterface>;

  private compiled: boolean;

  public constructor(
    instanceWrapperAbstractFactory: InstanceWrapperFactoryInterface,
    configParser: ConfigParserInterface,
  ) {
    this.instanceWrapperFactory = instanceWrapperAbstractFactory;
    this.configParser = configParser;

    this.publicProviders = new Map();
    this.modules = new Map();
    this.compiled = false;
  }

  public loadManifests(manifestsData: ManifestInterface[]) {
    const parsedManifest = this.configParser.parse(manifestsData);

    parsedManifest.forEach(manifest => {
      const newModule = new Module(this.instanceWrapperFactory, manifest);
      if (this.modules.has(newModule.name)) {
        throw new ModuleHasAlreadyExists().combine({ module: newModule.name });
      }
      this.modules.set(newModule.name, newModule);
    });
  }

  private addPublicProviders(providers: InstanceWrapperInterface[]) {
    providers.forEach(provider => {
      const publicProviderToken = buildPublicToken(
        provider.getModule().name,
        provider.token,
      );
      this.publicProviders.set(publicProviderToken, provider);
    });
  }

  private applyPublicProviders() {
    this.modules.forEach(currentModule => {
      this.addPublicProviders(currentModule.getPublicProviders());
    });
  }

  public compile() {
    if (this.compiled) {
      throw new AlreadyCompiledError();
    }

    this.applyPublicProviders();

    const injector = new Injector(this.modules, this.publicProviders);
    injector.resolveGraph();
    this.compiled = true;
  }

  public get(moduleName: string, token: Token): any {
    if (!this.compiled) {
      throw new NotCompiledError();
    }
    const publicProviderToken = buildPublicToken(moduleName, token);
    const instanceWrapper = this.publicProviders.get(publicProviderToken);
    if (!instanceWrapper) {
      throw new NotFoundProviderDefinitionError().combine({
        token,
      });
    }

    return instanceWrapper.instance;
  }
}
