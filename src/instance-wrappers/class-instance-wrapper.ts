/* eslint-disable max-classes-per-file */
import { InstanceWrapper, InstanceWrapperArguments } from './instance-wrapper';
import { ClassType, DependencyInterface } from '../internal-types';

export type ClassInstanceWrapperArguments = InstanceWrapperArguments & {
  type: ClassType;
  dependencies?: DependencyInterface[];
  autoFactory?: boolean;
};

export class ClassInstanceWrapper extends InstanceWrapper {
  private readonly type: ClassType;

  private readonly dependencies: DependencyInterface[];

  public readonly autoFactory: boolean;

  public constructor(
    moduleContext,
    {
      type,
      dependencies = [],
      autoFactory = false,
      ...instanceWrapperArguments
    }: ClassInstanceWrapperArguments,
  ) {
    super(moduleContext, instanceWrapperArguments);
    this.type = type;
    this.dependencies = dependencies;
    this.autoFactory = autoFactory;
  }

  public createInstance(
    dependencyResolver: (dependency: DependencyInterface) => any,
  ) {
    const resolvedDependencies = this.dependencies.map(dependencyResolver);

    const Constructor = this.type;
    if (this.autoFactory) {
      this.resolvedValue = class {
        public constructor(...args) {
          return new Constructor(...resolvedDependencies, ...args);
        }
      };
      return;
    }

    this.resolvedValue = new this.type(...resolvedDependencies);
  }
}
