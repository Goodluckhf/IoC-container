import { ProviderInterface } from './dto/provider.interface';
import { InstanceWrapperInterface, ModuleInterface } from './internal-types';

export interface InstanceWrapperFactoryInterface {
  create(
    provider: ProviderInterface,
    moduleContext: ModuleInterface,
  ): InstanceWrapperInterface;
}
