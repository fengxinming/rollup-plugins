import { Plugin } from 'rollup';

export type handler = (namedExport: string, pkgName: string) => string;

export interface ModuleOption {
  name: string | string[];
  importModule?: handler | true;
  importStyle?: handler | true;
}

export interface Options {
  hook?: 'load' | 'transform' | 'renderChunk';
  modules: ModuleOption[];
}

export function createPlugin(opts: Options): Plugin;

declare namespace plugin {
  export function createPlugin(opts: Options): Plugin;

  export function decamelize(name: string): string;
}

export default plugin;
