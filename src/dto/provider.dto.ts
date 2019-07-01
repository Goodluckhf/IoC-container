import { Transform } from 'class-transformer';
import { ProviderInterface } from './provider.interface';
import { ClassType, DependencyInterface } from '../internal-types';
import { DependencyDto } from './dependency.dto';

export class ProviderDto implements ProviderInterface {
  public autoFactory: boolean;

  @Transform(value => new DependencyDto(value))
  public dependencies: DependencyInterface[];

  public isPublic: boolean;

  public token: string;

  public useClass: ClassType;

  public useFactory: (...any) => any;

  public useValue: any;
}
