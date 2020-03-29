'use strict';

const { EOL } = require('os');
const { readdirSync, statSync } = require('fs');
const { parse, join } = require('path');
const { createFilter } = require('rollup-pluginutils');

function defaultFilter(file) {
  const obj = statSync(file);
  return obj.isFile();
}

function es({ dir, base }, exportsType, filter) {
  let exportString = '';

  switch (exportsType) {
    case 'named': {
      readdirSync(dir).forEach((file) => {
        if (file !== base) {
          const filePath = join(dir, file);
          if (filter(filePath)) {
            const model = file.replace(/\.(\w+)$/, '');
            exportString += `export { default as ${model} } from './${file}';${EOL}`;
          }
        }
      });

      return exportString;
    }
    default: {
      let importString = '';
      exportString = `${EOL}export default {`;
      readdirSync(dir).forEach((file) => {
        if (file !== base) {
          const filePath = join(dir, file);
          if (filter(filePath)) {
            const model = file.replace(/\.(\w+)$/, '');
            importString += `import ${model} from './${file}';${EOL}`;
            exportString += `${EOL}  ${model},`;
          }
        }
      });
      exportString = `${exportString.slice(0, -1)}${EOL}};${EOL}`;
      return importString + exportString;
    }
  }
}

function cjs({ dir, base }, exportsType, filter) {
  let exportString = `'use strict';${EOL}${EOL}`;

  switch (exportsType) {
    case 'named':
      readdirSync(dir).forEach((file) => {
        if (file !== base) {
          const filePath = join(dir, file);
          if (filter(filePath)) {
            const model = file.replace(/\.(\w+)$/, '');
            exportString += `exports.${model} = require('./${file}');${EOL}`;
          }
        }
      });

      return exportString;
    default:
      exportString += 'module.exports = {';
      readdirSync(dir).forEach((file) => {
        if (file !== base) {
          const filePath = join(dir, file);
          if (filter(filePath)) {
            const model = file.replace(/\.(\w+)$/, '');
            exportString += `${EOL}  ${model}: require('./${model}'),`;
          }
        }
      });
      exportString = `${exportString.slice(0, -1)}${EOL}};${EOL}`;

      return exportString;
  }
}

module.exports = function (options) {
  options = options || {};
  const exists = createFilter(options.include, options.exclude);
  const filter = options.filter || defaultFilter;
  const exportsType = options.exports === 'named' ? 'named' : 'default';
  const format = options.format === 'cjs' ? 'cjs' : 'es';

  return {
    name: 'combine',

    load(id) {
      if (!exists(id)) {
        return null;
      }

      switch (format) {
        case 'cjs':
          return cjs(parse(id), exportsType, filter);
        default:
          return es(parse(id), exportsType, filter);
      }
    }
  };
};
