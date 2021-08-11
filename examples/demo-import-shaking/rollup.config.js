const empty = require('../../packages/rollup-plugin-empty');
const importShaking = require('../../packages/rollup-plugin-import-shaking');

module.exports = {
  input: 'src/index.js',
  plugins: [
    empty({
      silent: false,
      dir: 'dist'
    }),
    importShaking({
      modules: [{
        name: 'celia',
        importStyle: false,
        importModule: (n, m) => `${m}/es/${n}`
      }]
    })
  ],
  output: {
    file: 'dist/index.esm.js',
    format: 'es'
  }
};
