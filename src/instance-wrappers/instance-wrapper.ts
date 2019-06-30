import {
  DependencyInterface,
  InstanceWrapperInterface,
  ModuleInterface,
  Token,
} from '../internal-types';

export interface InstanceWrapperArguments {
  token: Token;
  isPublic?: boolean;
}

export abstract class InstanceWrapper implements InstanceWrapperInterface {
  private readonly moduleContext: ModuleInterface;

  protected resolvedValue: any;

  public readonly isPublic: boolean;

  public readonly token: Token;

  protected constructor(
    moduleContext: ModuleInterface,
    { isPublic, token }: InstanceWrapperArguments,
  ) {
    this.token = token;
    this.moduleContext = moduleContext;
    this.isPublic = !!isPublic;
    this.resolvedValue = undefined;
  }

  public get resolved(): boolean {
    return typeof this.instance !== 'undefined';
  }

  public get instance(): any {
    return this.resolvedValue;
  }

  public getModule(): ModuleInterface {
    return this.moduleContext;
  }

  public abstract createInstance(
    resolver: (dependency: DependencyInterface) => any,
  );
}
