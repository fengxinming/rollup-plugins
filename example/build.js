'use strict';
const { writeFile } = require('fs');
const { relative, join, basename } = require('path');
const util = require('util');
const rollup = require('rollup');
const zlib = require('zlib');
const buble = require('rollup-plugin-buble');
const alias = require('rollup-plugin-alias');
const cjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const node = require('rollup-plugin-node-resolve');
const flow = require('rollup-plugin-flow-no-whitespace');
const { minify } = require('uglify-js');
const { getLogger } = require('clrsole');
const combine = require('../index');
const { resolve, config } = require('./config');
const {
  version,
  name
} = require('../package.json');

const gzip = util.promisify(zlib.gzip);
const logger = getLogger(basename(__filename, '.js'));
const banner = `/*
 * ${name}.js v${version}
 * (c) 2018-${new Date().getFullYear()} Jesse Feng
 * Released under the MIT License.
 */`;

/**
 * 根据自定义配置返回rollup配置
 * @param {String} name
 * @param {Object} opts
 */
function genConfig(name, opts) {
  const {
    inputOptions,
    outputOptions,
    aliases,
    replaceAll
  } = opts;

  inputOptions.plugins = [
    replace(Object.assign({
      __VERSION__: version
    }, replaceAll)),

    name === 'utils' && combine({
      include: /src\/index.js$/
      // exports: 'default' // or named
    }),

    flow(),
    buble(),
    alias(Object.assign({
      '@': resolve('./')
    }, aliases)),
    node({
      mainFields: ['module', 'main', 'jsnext'],
      browser: true
    }),
    cjs()
  ].concat(inputOptions.plugins || []);

  outputOptions.banner = banner;
  outputOptions.freeze = false;
  // outputOptions.exports = 'named';
  if (!outputOptions.name) {
    outputOptions.name = name;
  }

  Object.defineProperty(opts, '_name', {
    enumerable: false,
    value: name
  });

  return opts;
};

/**
 * 打包单个配置
 * @param {Object} config 单个配置
 */
async function buildSrc(config) {
  const {
    inputOptions,
    outputOptions,
    isProd = false
  } = config;

  const bundle = await rollup.rollup(inputOptions);
  const { output } = await bundle.write(outputOptions);

  const {
    file,
    dir
  } = outputOptions;

  if (!dir) {
    write(file, output[0].code, isProd);
  } else {
    output.forEach(({ code, fileName }) => {
      write(join(dir, fileName), code, isProd);
    });
  }
};

/**
 * 些入文件
 * @param {String} file
 * @param {String} code
 * @param {String} isProd
 */
async function print(file, code, isProd) {
  const zipped = await gzip(code);
  const extra = isProd ? `(gzipped: ${getSize(zipped)})` : '';
  logger.info(relative(process.cwd(), file), getSize(code), extra || '');
}
/**
 * 些入文件
 * @param {String} file
 * @param {String} code
 * @param {String} isProd
 */
async function write(file, code, isProd) {
  await print(file, code, isProd);
  if (isProd) {
    file = file.replace('.js', '.min.js');
    code = minify(code, {
      toplevel: true,
      output: {
        ascii_only: true,
        preamble: banner
      },
      compress: {
        pure_funcs: ['makeMap']
      }
    }).code;
    writeFile(file, code, (err) => {
      if (err) {
        throw err;
      }
      print(file, code, isProd);
    });
  }
}

/**
 * 获取文件大小
 * @param {String} code
 */
function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

Object.keys(config).forEach((key) => {
  buildSrc(genConfig(key, config[key]));
});
