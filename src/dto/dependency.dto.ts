import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { buildPublicToken } from '../helpers';
import { DependencyInterface, Token } from '../internal-types';
import { DependencyType } from '../public-interfaces/dependency.interface';

export class DependencyDto implements DependencyInterface {
  @IsString()
  @IsNotEmpty()
  public readonly token: Token;

  @IsOptional()
  @IsString()
  public readonly fromModule: string | null = null;

  @IsBoolean()
  public readonly autoFactory: boolean = false;

  public constructor(config: DependencyType) {
    if (Array.isArray(config)) {
      const [token, dependencyOptions] = config;
      this.token = token;
      this.autoFactory =
        (dependencyOptions && dependencyOptions.autoFactory) || false;
      this.fromModule = dependencyOptions && dependencyOptions.fromModule;
      if (this.fromModule) {
        this.token = buildPublicToken(this.fromModule, this.token);
      }
    } else {
      this.token = config;
    }
  }
}
