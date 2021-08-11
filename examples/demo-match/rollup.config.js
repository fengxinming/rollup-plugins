const match = require('../../packages/rollup-plugin-match');
const empty = require('../../packages/rollup-plugin-empty');

module.exports = [{
  input: 'src/*.js',
  plugins: [empty({
    silent: false,
    file: 'dist/lib/**/*.js'
  }), match()],
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
    match()
  ],
  output: {
    dir: 'dist/es',
    format: 'esm'
  }
}];
