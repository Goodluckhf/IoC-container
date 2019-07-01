import { ManifestInterface } from './dto/manifest.interface';
import { Token } from './internal-types';

export interface ContainerInterface {
  loadManifests(manifests: ManifestInterface[]);
  compile();
  get(moduleName: string, token: Token);
}
