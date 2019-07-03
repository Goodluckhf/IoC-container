import 'reflect-metadata';
import { Container as DIContainer } from './container';
import { InstanceWrapperFactory } from './instance-wrapper-factory';
import { ManifestTransformer } from './manifest-transformer';

// export Facade
export class IoCContainer extends DIContainer {
  // @ts-ignore
  public constructor() {
    const instanceWrapperFactory = new InstanceWrapperFactory();
    const manifestTransformer = new ManifestTransformer();
    return new DIContainer(instanceWrapperFactory, manifestTransformer);
  }
}

export { TestIoCContainer } from './test-ioc-container';
