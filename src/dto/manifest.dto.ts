import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ManifestInterface } from './manifest.interface';
import { ProviderInterface } from './provider.interface';
import { ProviderDto } from './provider.dto';

export class ManifestDto implements ManifestInterface {
  @IsNotEmpty()
  @IsString()
  public moduleName: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => ProviderDto)
  public providers: ProviderInterface[];
}
