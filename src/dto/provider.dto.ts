import { Exclude, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ProviderInterface } from './provider.interface';
import { ClassType, DependencyInterface } from '../internal-types';
import { DependencyDto } from './dependency.dto';

export class ProviderDto implements ProviderInterface {
  @IsBoolean()
  public autoFactory: boolean = false;

  @IsOptional()
  @ValidateNested()
  @Transform(array => array.map(value => new DependencyDto(value)))
  public dependencies: DependencyInterface[];

  @IsBoolean()
  public isPublic: boolean = false;

  @IsString()
  @IsNotEmpty()
  public token: string;

  // @TODO: Убрать Exclude
  @ValidateIf(
    o =>
      typeof o.useFactory === 'undefined' && typeof o.useValue === 'undefined',
  )
  @IsDefined()
  @Exclude()
  public useClass: ClassType;

  @ValidateIf(
    o => typeof o.useClass === 'undefined' && typeof o.useValue === 'undefined',
  )
  @IsDefined()
  @Exclude()
  public useFactory: (...any) => any;

  @ValidateIf(
    o =>
      typeof o.useFactory === 'undefined' && typeof o.useClass === 'undefined',
  )
  @IsDefined()
  @Exclude()
  public useValue: any;
}
