import 'reflect-metadata';
import { Container as DIContainer } from './container';
import { InstanceWrapperFactory } from './instance-wrapper-factory';
import { ConfigParser } from './config-parser';

// export Facade
export class Container extends DIContainer {
  // @ts-ignore
  public constructor() {
    const instanceWrapperFactory = new InstanceWrapperFactory();
    const configParser = new ConfigParser();
    return new DIContainer(instanceWrapperFactory, configParser);
  }
}

export { TestContainer } from './test-container';
