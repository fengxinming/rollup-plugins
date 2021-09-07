# rollup-plugin-replace-imports

[![npm package](https://nodei.co/npm/rollup-plugin-replace-imports.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/rollup-plugin-replace-imports)

> Replace unresolved imports.

[![NPM version](https://img.shields.io/npm/v/rollup-plugin-replace-imports.svg?style=flat)](https://npmjs.org/package/rollup-plugin-replace-imports)
[![NPM Downloads](https://img.shields.io/npm/dm/rollup-plugin-replace-imports.svg?style=flat)](https://npmjs.org/package/rollup-plugin-replace-imports)


## 使用

```js
import replaceImports from 'rollup-plugin-replace-imports';

export default {
  input: 'src/index.js',
  plugins: [
    // ...
  ],
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      exports: 'auto',
      plugins: [
        replaceImports(n => n.replace('/es/', '/')),
      ],
    },
    {
      dir: 'dist/es',
      format: 'es',
      exports: 'auto',
    },
  ],
};

```
