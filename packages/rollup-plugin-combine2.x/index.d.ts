interface Options {
  main?: 'index.js',
  outputDir?: boolean,
  exports?: 'named' | 'import' | 'named'
}

declare function combine(opts?: Options)

export default combine