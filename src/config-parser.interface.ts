import { ManifestInterface } from './dto/manifest.interface';

export interface ConfigParserInterface {
  parse(manifestsData: any[]): ManifestInterface[];
}
