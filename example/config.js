'use strict';

const { resolve: pathResolve } = require('path');

function resolve(...args) {
  return pathResolve(__dirname, ...args);
}

module.exports = {
  resolve: resolve,

  config: {
    utils: {
      isProd: true,
      inputOptions: {
        input: resolve('./src/index.js')
      },
      outputOptions: {
        file: resolve('./dist/utils.js'),
        format: 'umd',
        legacy: false,
        esModule: false
      }
    },
    modular: {
      inputOptions: {
        input: [
          resolve('./src/isBoolean.js'),
          resolve('./src/isFunction.js'),
          resolve('./src/isNil.js'),
          resolve('./src/isNumber.js'),
          resolve('./src/isObject.js'),
          resolve('./src/isString.js'),
          resolve('./src/isUndefined.js')
        ]
      },
      outputOptions: {
        dir: resolve('./dist'),
        format: 'cjs',
        legacy: false,
        esModule: false
      }
    }
  }
}
