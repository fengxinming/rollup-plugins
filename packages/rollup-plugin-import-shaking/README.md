
# rollup-plugin-import-shaking

Import modules as needed.

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
export interface ModuleOption {
  name: string;
  importModule?: (namedExport: string, name: string) => string;
  importStyle?: (namedExport: string, name: string) => string;
}

export interface Options {
  modules: ModuleOption[]
}

type createPlugin = (opts?: Options) => Plugin;
```

## Example

[demo-import-shaking](examples/demo-import-shaking)
