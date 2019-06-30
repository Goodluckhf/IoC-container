import { InjectorInterface } from './injector.interface';
import { ClassInstanceWrapper } from './instance-wrappers/class-instance-wrapper';
import { CircularDependencyError } from './errors/circular-dependency.error';
import { RequiredAutoFactoryDefinitionError } from './errors/required-autofactory-definition.error';
import { NotFoundProviderDefinitionError } from './errors/not-found-provider-definition.error';
import {
  DependencyInterface,
  InstanceWrapperInterface,
  ModuleInterface,
  Token,
} from './internal-types';

export class Injector implements InjectorInterface {
  private readonly modules: Map<string, ModuleInterface>;

  private readonly publicProviders: Map<Token, InstanceWrapperInterface>;

  public constructor(
    modules: Map<string, ModuleInterface>,
    publicProviders: Map<Token, InstanceWrapperInterface>,
  ) {
    this.modules = modules;
    this.publicProviders = publicProviders;
  }

  public resolveGraph() {
    this.modules.forEach(currentModule => {
      this.resolveModule(currentModule);
    });
  }

  private resolveModule(moduleForResolve: ModuleInterface) {
    moduleForResolve.getProviders().forEach(provider => {
      this.resolveProvider(provider);
    });
  }

  // @TODO: Переименовать в instanceWrapper
  private resolveProvider(
    provider: InstanceWrapperInterface,
    resolvingSet = new Set(),
  ) {
    if (provider.resolved) {
      return;
    }

    if (resolvingSet.has(provider.token)) {
      throw new CircularDependencyError().combine({
        token: provider.token,
        moduleContext: provider.getModule().name,
      });
    }
    resolvingSet.add(provider.token);

    const dependencyResolver = (dependency: DependencyInterface): any => {
      const dependencyProvider = this.getProvider(
        provider.getModule(),
        dependency.token,
      );

      this.resolveProvider(dependencyProvider, resolvingSet);

      if (
        dependencyProvider instanceof ClassInstanceWrapper &&
        dependencyProvider.autoFactory &&
        !dependency.autoFactory
      ) {
        throw new RequiredAutoFactoryDefinitionError().combine({
          dependencyToken: dependency.token,
          providerToken: provider.token,
        });
      }

      return dependencyProvider.instance;
    };

    provider.createInstance(dependencyResolver);
  }

  private getProvider(
    contextModule: ModuleInterface,
    token: Token,
  ): InstanceWrapperInterface {
    if (contextModule.has(token)) {
      return contextModule.getProviderByToken(token);
    }

    if (this.publicProviders.has(token)) {
      return this.publicProviders.get(token);
    }

    throw new NotFoundProviderDefinitionError().combine({
      token,
      contextModule: contextModule.name,
    });
  }
}
