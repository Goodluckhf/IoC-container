import { Type } from 'class-transformer';
import { ManifestInterface } from './manifest.interface';
import { ProviderInterface } from './provider.interface';
import { ProviderDto } from './provider.dto';

export class ManifestDto implements ManifestInterface {
  public moduleName: string;

  @Type(() => ProviderDto)
  public providers: ProviderInterface[];
}
