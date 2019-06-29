import { InstanceWrapper, InstanceWrapperArguments } from './instance-wrapper';
import { DependencyInterface, ModuleInterface } from '../internal-types';

export type ValueInstanceWrapperArguments = InstanceWrapperArguments & {
  value: any;
};

export class ValueInstanceWrapper extends InstanceWrapper {
  public constructor(
    contextModule: ModuleInterface,
    { value, ...instanceWrapperArguments }: ValueInstanceWrapperArguments,
  ) {
    super(contextModule, instanceWrapperArguments);
    this.resolvedValue = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public createInstance(resolver: (dependency: DependencyInterface) => any) {}
}
