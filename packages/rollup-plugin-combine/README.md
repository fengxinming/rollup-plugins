# rollup-plugin-combine

[![npm package](https://nodei.co/npm/rollup-plugin-combine.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/rollup-plugin-combine)

> A rollup plugin for combining dynamic JavaScript files which can be compiled into a library or application.

[![NPM version](https://img.shields.io/npm/v/rollup-plugin-combine.svg?style=flat)](https://npmjs.org/package/rollup-plugin-combine)
[![NPM Downloads](https://img.shields.io/npm/dm/rollup-plugin-combine.svg?style=flat)](https://npmjs.org/package/rollup-plugin-combine)


## Installation

```bash
npm install rollup-plugin-combine --save-dev
```

## Usage

rollup.config.js

### generate chunks

```js
const match = require('rollup-plugin-match');
const empty = require('rollup-plugin-combine');
const combine = require('rollup-plugin-combine');

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

```

### generate one chunk

```js
const match = require('rollup-plugin-match');
const empty = require('rollup-plugin-combine');
const combine = require('rollup-plugin-combine');

module.exports = {
  input: 'src/*.js',
  plugins: [
    empty({
      silent: false,
      dir: 'dist'
    }),
    match(),
    combine()
  ],
  output: {
    file: 'dist/index.es.js',
    format: 'es'
  }
};

```

## Options
- main `string` (default: `'index.js'`) virtual entry
- outputDir `boolean` generate chunks or not
- exports `string` (default: `'named'`) `'import'`、`'named'` or `'default'`
- camelCase `object` or `false` (optional) [see here](https://www.npmjs.com/package/camelcase)
- dts `boolean` (optional) create an `index.d.ts` file
