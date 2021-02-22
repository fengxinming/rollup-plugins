# rollup-plugin-replace-imports

> 替换导入模块的路径

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
