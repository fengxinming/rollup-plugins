'use strict';

const { readdirSync } = require('fs');
const { resolve: pathResolve, join } = require('path');

function resolve(...args) {
  return pathResolve(__dirname, ...args);
}

const srcDir = resolve('./src');

module.exports = {
  resolve: resolve,

  config: {
    main: {
      isProd: true,
      inputOptions: {
        input: resolve('./src/index.js')
      },
      outputOptions: {
        file: resolve('./dist/main.js'),
        format: 'umd',
        legacy: false,
        esModule: false
      }
    },
    modular: {
      inputOptions: {
        input: readdirSync(srcDir).map(n => join(srcDir, n))
      },
      outputOptions: {
        dir: resolve('./dist'),
        format: 'cjs',
        legacy: false,
        esModule: false
      }
    }
  }
};
