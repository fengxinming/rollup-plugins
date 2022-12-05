'use strict';

const { EOL } = require('os');
const { parse, join } = require('path');
const camelCase = require('camelcase');

function createPlugin(opts) {
  if (!opts) {
    opts = {};
  }

  const { outputDir, camelCase: camelCaseOptions } = opts;
  let { main, exports: exportsType } = opts;
  let files = [];

  exportsType = exportsType || 'named';
  main = main || 'index.js';

  const camelCaseName = (name) => {
    if (camelCaseOptions !== false) {
      name = camelCase(name, camelCaseOptions);
    }
    return name;
  };

  return {
    name: 'combine',

    options(inputOptions) {
      const { input } = inputOptions;
      files = Array.isArray(input) ? [...input] : [];
      if (!outputDir) {
        inputOptions.input = main;
      }
      else {
        inputOptions.input.push(main);
      }
    },

    resolveId(id) {
      if (id === main) {
        return main;
      }
    },

    load(id) {
      if (id === main) {
        if (!files.length) {
          return '';
        }

        let name;
        switch (exportsType) {
          case 'named':
            return files
              .map((file) => {
                const { name, dir } = parse(file);
                return `export { default as ${camelCaseName(name)} } from '${join(dir, name)}';`;
              })
              .join(EOL);
          case 'default': {
            const importDeclare = [];
            const exportDeclare = [];
            for (const file of files) {
              const parsedPath = parse(file);
              name = camelCaseName(parsedPath.name);
              importDeclare[importDeclare.length] = `import ${name} from '${join(parsedPath.dir, parsedPath.name)}';`;
              exportDeclare[exportDeclare.length] = name;
            }
            return exportDeclare.length
              ? `${importDeclare.join(EOL)}${EOL}export default { ${exportDeclare.join(', ')} };${EOL}`
              : '';
          }
          default:
            return files
              .map((file) => {
                const { name, dir } = parse(file);
                return `import '${join(dir, name)}';`;
              })
              .join(EOL);
        }
      }
    }
  };
}

module.exports = createPlugin;
