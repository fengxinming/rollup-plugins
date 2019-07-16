# rollup-plugin-combine
A rollup plugin for combining dynamic JavaScript files which can be compiled into a library or application.

## Installation

```bash
npm install rollup-plugin-combine --save-dev
```

## Usage

```js
const combine = require('rollup-plugin-combine');

const bundle = await rollup.rollup({
  input: resolve('./src/index.js'), // Empty file
  plugins: [
    combine({
      include: /src\/index.js$/
    }),
  ]
});
const { output } = await bundle.write({
  file: resolve('./dist/index.js'),
  format: 'umd',
  legacy: false,
  esModule: false
});

```

### Options
- include String / RegExp / Array
- exclude String / RegExp / Array
- filter  Function(filePath)      Filter files which can be exported
- exports 'default' / 'named'
- format  'es' / 'cjs'

## Example

- [rollup-plugin-combine](example)
