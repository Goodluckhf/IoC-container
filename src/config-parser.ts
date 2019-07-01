import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ValidationError } from './errors/validation.error';
import { ConfigParserInterface } from './config-parser.interface';
import { ManifestDto } from './dto/manifest.dto';
import { ManifestInterface } from './dto/manifest.interface';
import { ManifestInterface as PublicManifestInterface } from './public-interfaces/manifest.interface';

export class ConfigParser implements ConfigParserInterface {
  public parse(manifestsData: PublicManifestInterface[]): ManifestInterface[] {
    return manifestsData.map(manifestData => {
      const manifest = plainToClass(ManifestDto, manifestData);
      const errors = validateSync(manifest);
      if (errors.length > 0) {
        throw new ValidationError().combine(errors);
      }
      return manifest;
    });
  }
}
