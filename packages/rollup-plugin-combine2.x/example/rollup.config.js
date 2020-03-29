const match = require('../../rollup-plugin-match');
const empty = require('../../rollup-plugin-empty');
const combine = require('../index');

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
      outputDir: true
    })
  ],
  output: {
    dir: 'dist/es',
    format: 'es'
  }
}];
