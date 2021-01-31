'use strict';

const { EOL } = require('os');
const { parse } = require('path');
const camelCase = require('camelcase');

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
        switch (exportsType) {
          case 'named':
            return files.map((file) => {
              let { name } = parse(file);
              name = camelCase(name, camelCaseOptions);
              return `export { default as ${name} } from '${file}';`;
            }).join(EOL);
          case 'default': {
            let importString = '';
            let exportString = `${EOL}export default {`;
            files.forEach((file) => {
              let { name } = parse(file);
              name = camelCase(name, camelCaseOptions);
              importString += `import ${name} from '${file}';${EOL}`;
              exportString += `${name},`;
            });
            exportString = `${exportString.slice(0, -1)}};${EOL}`;
            return importString + exportString;
          }
          default:
            return files.map((file) => {
              return `import '${file}';`;
            }).join(EOL);
        }
      }
    }
  };
};
