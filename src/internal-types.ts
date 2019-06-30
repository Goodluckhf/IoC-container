export interface DependencyInterface {
  readonly token: Token;
  readonly fromModule: string;
  readonly autoFactory: boolean;
}

export interface ClassType {
  new (...args: any[]): any;
}

export type Token = string;

export interface DependencyOptions {
  autoFactory?: boolean;
  fromModule?: string;
}

export type CustomDependencyType = [Token, DependencyOptions];

export type DependencyType = Token | CustomDependencyType;

// Due to circular dependency
export interface ModuleInterface {
  readonly name: string;

  override();
  getPublicProviders(): InstanceWrapperInterface[];
  getProviders(): InstanceWrapperInterface[];
  has(token: Token): boolean;
  getProviderByToken(token: Token): InstanceWrapperInterface | undefined;
}

export interface InstanceWrapperInterface {
  readonly isPublic: boolean;

  readonly token: Token;

  readonly resolved: boolean;

  readonly instance: any;
  getModule(): ModuleInterface;

  createInstance(resolver: (dependency: DependencyInterface) => any);
}
