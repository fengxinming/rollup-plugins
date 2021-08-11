import { Plugin } from 'rollup';

export interface ModuleOption {
  name: string;
  importModule?: (namedExport: string, name: string) => string;
  importStyle?: (namedExport: string, name: string) => string;
}

export interface Options {
  modules: ModuleOption[]
}

type createPlugin = (opts?: Options) => Plugin;

export default createPlugin