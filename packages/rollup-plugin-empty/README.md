# rollup-plugin-empty

[![npm package](https://nodei.co/npm/rollup-plugin-empty.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/rollup-plugin-empty)

> A rollup plugin for emptying dir or deleting files.

[![NPM version](https://img.shields.io/npm/v/rollup-plugin-empty.svg?style=flat)](https://npmjs.org/package/rollup-plugin-empty)
[![NPM Downloads](https://img.shields.io/npm/dm/rollup-plugin-empty.svg?style=flat)](https://npmjs.org/package/rollup-plugin-empty)

## Installation

```bash
npm install rollup-plugin-empty --save-dev
```

## Usage

rollup.config.js

### generate chunks

```js
const empty = require('rollup-plugin-empty');
const match = require('rollup-plugin-match');

module.exports = {
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
    format: 'es'
  }
};

```

## Options
- file `String|Array` delete files if matches
- dir `String|Array` empty dir if matches
- silent `Boolean` show info after deleting
- glob see the [fast-glob options](https://github.com/mrmlnc/fast-glob#options-3)

