import { InstanceWrapperFactoryInterface } from './instance-wrapper-factory.interface';
import { ProviderInterface } from './dto/provider.interface';
import { ValueInstanceWrapper } from './instance-wrappers/value-instance-wrapper';
import { ClassInstanceWrapper } from './instance-wrappers/class-instance-wrapper';
import { FactoryInstanceWrapper } from './instance-wrappers/factory-instance-wrapper';
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

    if (typeof provider.useValue !== 'undefined') {
      return new ValueInstanceWrapper(moduleContext, {
        ...commonInstanceArgs,
        value: provider.useValue,
      });
    }

    if (typeof provider.useClass !== 'undefined') {
      return new ClassInstanceWrapper(moduleContext, {
        ...commonInstanceArgs,
        dependencies: provider.dependencies,
        type: provider.useClass,
        autoFactory: provider.autoFactory,
      });
    }

    if (typeof provider.useFactory !== 'undefined') {
      return new FactoryInstanceWrapper(moduleContext, {
        ...commonInstanceArgs,
        dependencies: provider.dependencies,
        factory: provider.useFactory,
      });
    }

    throw new Error('invalid type of provider');
  }
}
