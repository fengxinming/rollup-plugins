'use strict';

/**
 * 替换导入文件的路径
 *
 * @param {object|function} opts
 */
function replaceImports(opts) {
  if (typeof opts === 'function') {
    opts = { replacement: opts };
  }

  const { replacement } = opts || {};
  if (typeof replacement !== 'function') {
    throw new TypeError(`Expect a function as replacement but got ${typeof replacement}.`);
  }

  return {
    name: 'replace-imports',

    renderChunk(code, chunk) {
      const { importedBindings, imports } = chunk;
      chunk.imports = imports.map((n, i) => {
        const newImport = replacement(n, i) || n;
        if (newImport !== n) {
          importedBindings[newImport] = importedBindings[n];
          delete importedBindings[n];
          code = code.replace(n, newImport);
        }
        return n;
      });
      return { code, map: chunk.map };
    },
  };
}


module.exports = replaceImports;
