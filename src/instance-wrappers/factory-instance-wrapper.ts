import { InstanceWrapper, InstanceWrapperArguments } from './instance-wrapper';
import { DependencyInterface } from '../internal-types';

export type FactoryInstanceWrapperArguments = InstanceWrapperArguments & {
  factory: () => any;
  dependencies: DependencyInterface[];
};

export class FactoryInstanceWrapper extends InstanceWrapper {
  private readonly dependencies: DependencyInterface[];

  private readonly factory: (...any) => any;

  public constructor(
    contextModule,
    {
      dependencies,
      factory,
      ...instanceWrapperArguments
    }: FactoryInstanceWrapperArguments,
  ) {
    super(contextModule, instanceWrapperArguments);
    this.factory = factory;
    this.dependencies = dependencies;
  }

  public createInstance(
    dependencyResolver: (dependency: DependencyInterface) => any,
  ) {
    const resolvedDependencies = this.dependencies.map(dependencyResolver);
    this.resolvedValue = this.factory(...resolvedDependencies);
  }
}
