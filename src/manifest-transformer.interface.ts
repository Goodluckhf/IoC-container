import { ManifestInterface } from './dto/manifest.interface';
import { ManifestInterface as PublicManifestInterface } from './public-interfaces/manifest.interface';

export interface ManifestTransformerInterface {
  transform(manifestsData: PublicManifestInterface[]): ManifestInterface[];
}
