# rollup-plugin-match

A rollup plugin for matching files.

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

