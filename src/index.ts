import 'reflect-metadata';
import { Container } from './container';
import { InstanceWrapperFactory } from './instance-wrapper-factory';
import { ManifestTransformer } from './manifest-transformer';

// export Facade
export class IoCContainer extends Container {
  // @ts-ignore
  public constructor() {
    const instanceWrapperFactory = new InstanceWrapperFactory();
    const manifestTransformer = new ManifestTransformer();
    return new Container(instanceWrapperFactory, manifestTransformer);
  }
}

export { TestIoCContainer } from './test-ioc-container';

export * from './public-interfaces/manifest.interface';
export * from './public-interfaces/dependency.interface';
export * from './public-interfaces/provider.interface';
export * from './container.interface';
