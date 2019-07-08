import { Token } from '../internal-types';

export interface DependencyOptions {
  autoFactory?: boolean;
  fromModule?: string;
}

export type CustomDependencyType = [Token, DependencyOptions];

export type DependencyType = Token | CustomDependencyType;
