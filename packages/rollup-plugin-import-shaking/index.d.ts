import { Plugin } from 'rollup';

export type handler = (namedExport: string, pkgName: string) => string;

export interface ModuleOption {
  name: string | string[];
  importModule?: handler | true;
  importStyle?: handler | true;
}

export interface Options {
  modules: ModuleOption[]
}

function createPlugin (opts: Options): Plugin;

declare namespace createPlugin {
  decamelize: (name: string) => string;
  createPlugin: createPlugin;
}

export default createPlugin;
