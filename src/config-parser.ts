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
      // https://github.com/typestack/class-transformer/issues/276
      // @TODO: Переделать полностью на plainToClass
      manifest.providers.forEach((provider, key) => {
        if (manifestData.providers[key].useValue) {
          // eslint-disable-next-line no-param-reassign
          provider.useValue = manifestData.providers[key].useValue;
          return;
        }
        if (manifestData.providers[key].useClass) {
          // eslint-disable-next-line no-param-reassign
          provider.useClass = manifestData.providers[key].useClass;
          return;
        }
        if (manifestData.providers[key].useFactory) {
          // eslint-disable-next-line no-param-reassign
          provider.useFactory = manifestData.providers[key].useFactory;
        }
      });

      const errors = validateSync(manifest);
      if (errors.length > 0) {
        throw new ValidationError().combine(errors);
      }
      return manifest;
    });
  }
}
