import { plainToClass } from 'class-transformer';
import { ConfigParserInterface } from './config-parser.interface';
import { ManifestDto } from './dto/manifest.dto';
import { ManifestInterface } from './dto/manifest.interface';

export class ConfigParser implements ConfigParserInterface {
  public parse(manifestsData: any[]): ManifestInterface[] {
    return manifestsData.map(manifestData => {
      const manifest = plainToClass(ManifestDto, manifestData);

      return manifest;
    });
  }
}
