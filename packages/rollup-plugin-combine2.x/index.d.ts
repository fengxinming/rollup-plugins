interface Options {
  main?: 'index.js',
  outputDir?: boolean,
  exports?: 'default' | 'import' | 'named'
}

declare function combine(opts?: Options)

export default combine