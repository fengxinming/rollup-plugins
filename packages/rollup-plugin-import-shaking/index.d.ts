import { Plugin } from 'rollup';

export type handler = (namedExport: string, pkgName: string) => string;

export interface ModuleOption {
  name: string | string[];
  importModule?: handler | true;
  importStyle?: handler | true;
}

export interface Options {
  modules: ModuleOption[];
}

export type createPlugin = (opts: Options) => Plugin;

export type decamelize = (name: string) => string;

declare interface createPlugin {
  decamelize: decamelize;
  createPlugin: createPlugin;
}

export default createPlugin;
