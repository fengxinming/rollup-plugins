const empty = require('../../packages/rollup-plugin-empty');
const importShaking = require('../../packages/rollup-plugin-import-shaking');
const replaceImports = require('../../packages/rollup-plugin-replace-imports');

module.exports = {
  input: 'src/index.js',
  plugins: [
    empty({
      silent: false,
      dir: 'dist'
    }),
    importShaking({
      modules: [{
        name: ['module1', 'module2'],
        importModule: (n, m) => `${m}/es/${n}`
      }, {
        name: 'module3',
        importModule: (n, m) => `${m}/es/${n}`
      }]
    })
  ],
  output: [{
    file: 'dist/index.esm.js',
    format: 'es'
  }, {
    file: 'dist/index.cjs.js',
    format: 'cjs',
    plugins: [
      replaceImports({
        replacement(name) {
          return name.replace('/es/', '/');
        }
      })
    ]
  }]
};
