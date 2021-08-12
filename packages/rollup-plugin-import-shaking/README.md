
# rollup-plugin-import-shaking

Import modules as needed.

## Installation

```bash
npm install rollup-plugin-import-shaking --save-dev
```

## Usage

rollup.config.js

### Example

```js
const empty = require('rollup-plugin-empty');
const importShaking = require('rollup-plugin-import-shaking');
const replaceImports = require('rollup-plugin-replace-imports');

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

export type createPlugin = (opts: Options) => Plugin;

export type decamelize = (name: string) => string;

declare interface createPlugin {
  decamelize: decamelize;
  createPlugin: createPlugin;
}
```

## Example

[demo-import-shaking](examples/demo-import-shaking)
