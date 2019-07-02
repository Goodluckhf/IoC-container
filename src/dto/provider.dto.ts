import { Exclude, Transform } from 'class-transformer';
import { ProviderInterface } from './provider.interface';
import { ClassType, DependencyInterface } from '../internal-types';
import { DependencyDto } from './dependency.dto';

export class ProviderDto implements ProviderInterface {
  public autoFactory: boolean;

  @Transform(array => array.map(value => new DependencyDto(value)))
  public dependencies: DependencyInterface[];

  public isPublic: boolean;

  public token: string;

  @Exclude()
  public useClass: ClassType;

  @Exclude()
  public useFactory: (...any) => any;

  @Exclude()
  public useValue: any;
}
