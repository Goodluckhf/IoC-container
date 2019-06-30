import { InstanceWrapperFactoryInterface } from './instance-wrapper-factory.interface';
import { ProviderInterface } from './provider.interface';
import { ValueInstanceWrapper } from './instance-wrappers/value-instance-wrapper';
import { ClassInstanceWrapper } from './instance-wrappers/class-instance-wrapper';
import { FactoryInstanceWrapper } from './instance-wrappers/factory-instance-wrapper';
import { Dependency } from './dependency';
import { InstanceWrapperInterface, ModuleInterface } from './internal-types';

export class InstanceWrapperFactory implements InstanceWrapperFactoryInterface {
  public create(
    provider: ProviderInterface,
    moduleContext: ModuleInterface,
  ): InstanceWrapperInterface {
    const commonInstanceArgs = {
      isPublic: provider.isPublic,
      token: provider.token,
    };

    const dependenciesDefinition = Array.isArray(provider.dependencies)
      ? provider.dependencies
      : [];

    if (typeof provider.useValue !== 'undefined') {
      return new ValueInstanceWrapper(moduleContext, {
        ...commonInstanceArgs,
        value: provider.useValue,
      });
    }

    if (typeof provider.useClass !== 'undefined') {
      const dependencies = dependenciesDefinition.map(
        dependency => new Dependency(dependency),
      );
      return new ClassInstanceWrapper(moduleContext, {
        ...commonInstanceArgs,
        dependencies,
        type: provider.useClass,
        autoFactory: provider.autoFactory,
      });
    }

    if (typeof provider.useFactory !== 'undefined') {
      const dependencies = dependenciesDefinition.map(
        dependency => new Dependency(dependency),
      );
      return new FactoryInstanceWrapper(moduleContext, {
        ...commonInstanceArgs,
        dependencies,
        factory: provider.useFactory,
      });
    }

    throw new Error('invalid type of provider');
  }
}
