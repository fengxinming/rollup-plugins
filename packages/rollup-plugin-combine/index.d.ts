import camelcase from 'camelcase';
import { Plugin } from 'rollup';

export interface Options {
  main?: 'index.js',
  outputDir?: boolean,
  exports?: 'default' | 'import' | 'named',
  camelCase?: camelcase.Options | false
}

type createPlugin = (opts?: Options) => Plugin;

export default createPlugin;