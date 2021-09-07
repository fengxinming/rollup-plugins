# rollup-plugin-match

[![npm package](https://nodei.co/npm/rollup-plugin-match.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/rollup-plugin-match)

> A rollup plugin for matching files.

[![NPM version](https://img.shields.io/npm/v/rollup-plugin-match.svg?style=flat)](https://npmjs.org/package/rollup-plugin-match)
[![NPM Downloads](https://img.shields.io/npm/dm/rollup-plugin-match.svg?style=flat)](https://npmjs.org/package/rollup-plugin-match)


## Installation

```bash
npm install rollup-plugin-match --save-dev
```

## Usage

rollup.config.js

### generate chunks

```js
const match = require('rollup-plugin-match');
const empty = require('rollup-plugin-empty');

module.exports = {
  input: 'src/*.js',
  plugins: [
    empty({
      silent: false,
      dir: 'dist/es'
    }),
    match(),
  ],
  output: {
    dir: 'dist/es',
    format: 'es'
  }
};

```

## Options

See the [fast-glob options](https://github.com/mrmlnc/fast-glob#options-3)

