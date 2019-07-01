import { Token } from './internal-types';
import { ManifestInterface as publicManifestInterface } from './public-interfaces/manifest.interface';

export interface ContainerInterface {
  loadManifests(manifests: publicManifestInterface[]);
  compile();
  get(moduleName: string, token: Token);
}
