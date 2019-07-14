'use strict';

const { EOL } = require('os');
const { readdirSync, statSync } = require('fs');
const { parse, join } = require('path');
const { createFilter } = require('rollup-pluginutils');

function defaultFilter(file) {
  const obj = statSync(file);
  return obj.isFile();
}

module.exports = function (options = {}) {
  const exists = createFilter(options.include, options.exclude);

  return {
    name: 'combine',

    load(id) {
      if (!exists(id)) {
        return null;
      }

      const filter = options.filter || defaultFilter;
      const exportsType = options.exports === 'named' ? '' : 'default ';

      const { dir, base } = parse(id);
      let importString = '';
      let exportString = `${EOL}export ${exportsType}{${EOL}`;
      readdirSync(dir).forEach((file) => {
        if (file !== base) {
          const filePath = join(dir, file);
          if (filter(filePath)) {
            const model = file.replace(/\.(\w+)$/, '');
            importString += `import ${model} from './${file}';${EOL}`;
            exportString += `  ${model},${EOL}`;
          }
        }
      });
      exportString = `${exportString.slice(0, -2)}${EOL}};${EOL}`;

      return importString + exportString;
    }
  };
};
