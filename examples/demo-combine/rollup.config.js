const match = require('../../packages/rollup-plugin-match');
const empty = require('../../packages/rollup-plugin-empty');
const combine = require('../../packages/rollup-plugin-combine2.x');

module.exports = [{
  input: 'src/*.js',
  plugins: [
    empty({
      silent: false,
      file: 'dist/cjs.js'
    }),
    match(),
    combine()
  ],
  output: {
    file: 'dist/cjs.js',
    format: 'cjs'
  }
}, {
  input: 'src/*.js',
  plugins: [
    empty({
      silent: false,
      file: 'dist/lib/**/*.js'
    }),
    match()
  ],
  output: {
    dir: 'dist/lib',
    export: 'auto',
    format: 'cjs'
  }
}, {
  input: 'src/*.js',
  plugins: [
    empty({
      silent: false,
      dir: 'dist/es'
    }),
    match(),
    combine({
      exports: 'default',
      outputDir: true
    })
  ],
  output: {
    dir: 'dist/es',
    format: 'es'
  }
}];
