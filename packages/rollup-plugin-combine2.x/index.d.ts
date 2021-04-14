import camelcase from 'camelcase';
interface Options {
  main?: 'index.js',
  outputDir?: boolean,
  exports?: 'default' | 'import' | 'named',
  camelCase?: camelcase.Options | false
}

declare function combine(opts?: Options)

export default combine