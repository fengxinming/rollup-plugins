'use strict';

const { EOL } = require('os');
const { parse } = require('path');
const camelCase = require('camelcase');

function camelCaseName(file, camelCaseOptions) {
  let { name } = parse(file);
  if (camelCaseOptions !== false) {
    name = camelCase(name, camelCaseOptions);
  }
  return name;
}

module.exports = function (opts) {
  let { main, outputDir, exports: exportsType, camelCase: camelCaseOptions } = opts || {};
  let files = [];
  exportsType = exportsType || 'named';

  main = main || 'index.js';

  return {
    name: 'combine',

    options(inputOptions) {
      files = [...inputOptions.input];
      if (!outputDir) {
        inputOptions.input = main;
      } else {
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
          return Promise.resolve('');
        }

        let name;
        switch (exportsType) {
          case 'named':
            return files.map(file => `export { default as ${camelCaseName(file, camelCaseOptions)} } from '${file}';`).join(EOL);
          case 'default': {
            const importDeclare = [];
            const exportDeclare = [];
            for (const file of files) {
              name = camelCaseName(file, camelCaseOptions);
              importDeclare[importDeclare.length] = `import ${name} from '${file}';`;
              exportDeclare[exportDeclare.length] = name;
            }
            return exportDeclare.length
              ? `${importDeclare.join(EOL)}${EOL}export default { ${exportDeclare.join(', ')} };${EOL}`
              : '';
          }
          default:
            return files.map(file => `import '${file}';`).join(EOL);
        }
      }
    }
  };
};
