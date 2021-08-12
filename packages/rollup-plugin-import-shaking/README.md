
# rollup-plugin-import-shaking

A rollup plugin for import shaking.

## Installation

```bash
npm install rollup-plugin-import-shaking --save-dev
```

## Usage

rollup.config.js

### generate chunks

```js
const importShaking = require('rollup-plugin-import-shaking');

module.exports = {
  input: 'src/index.js',
  plugins: [
    importShaking({
      modules: [{
        name: 'celia',
        importModule: (n, m) => `${m}/es/${n}`,
        importStyle: false
      }]
    })
  ],
  output: {
    file: 'dist/index.esm.js',
    format: 'es'
  }
};
```

## Options

```ts
import { Plugin } from 'rollup';

export type handler = (namedExport: string, pkgName: string) => string;

export interface ModuleOption {
  name: string | string[];
  importModule?: handler | true;
  importStyle?: handler | true;
}

export interface Options {
  modules: ModuleOption[];
}

function createPlugin (opts: Options): Plugin;

declare namespace createPlugin {
  decamelize: (name: string) => string;
  createPlugin: createPlugin;
}
```

## Example

[demo-import-shaking](examples/demo-import-shaking)
