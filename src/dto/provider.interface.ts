import { ClassType, DependencyInterface } from '../internal-types';

export interface ProviderInterface {
  token: string;

  isPublic?: boolean;

  autoFactory?: boolean;

  /**
   * Arguments of constructor
   */
  dependencies?: DependencyInterface[];

  /**
   * Provide by class
   */
  useClass?: ClassType;

  /**
   * provide by constant
   */
  useValue?: any;

  /**
   * provide dynamic value
   */
  useFactory?: (...any) => any;
}
