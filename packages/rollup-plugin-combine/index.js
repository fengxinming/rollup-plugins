'use strict';

const { EOL } = require('os');
const { parse, join, isAbsolute } = require('path');
const { writeFile } = require('fs');
const camelCase = require('camelcase');

function createPlugin(opts) {
  if (!opts) {
    opts = {};
  }

  const { outputDir, camelCase: camelCaseOptions, dts } = opts;
  let { main, exports: exportsType } = opts;
  let files = [];
  let mainCode = '';

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
            mainCode = files
              .map((file) => {
                const { name, dir } = parse(file);
                return `export { default as ${camelCaseName(name)} } from '${join(dir, name)}';`;
              })
              .join(EOL);
            break;
          case 'default': {
            const importDeclare = [];
            const exportDeclare = [];
            for (const file of files) {
              const parsedPath = parse(file);
              name = camelCaseName(parsedPath.name);
              importDeclare[importDeclare.length] = `import ${name} from '${join(parsedPath.dir, parsedPath.name)}';`;
              exportDeclare[exportDeclare.length] = name;
            }
            mainCode = exportDeclare.length
              ? `${importDeclare.join(EOL)}${EOL}export default { ${exportDeclare.join(', ')} };${EOL}`
              : '';
            break;
          }
          default:
            mainCode = files
              .map((file) => {
                const { name, dir } = parse(file);
                return `import '${join(dir, name)}';`;
              })
              .join(EOL);
        }
        return mainCode;
      }
    },

    writeBundle(options) {
      if (['es', 'esm'].includes(options.format) && dts) {
        const { dir, file } = options;
        let p;
        if (file) {
          p = parse(file).dir;
        } else if (dir) {
          p = dir
        }
        if(p && !isAbsolute(p)) {
          p = join(process.cwd(), p);
        }
        if (p && mainCode) {
          writeFile(join(p, `${main.replace(/\.\w+$/, '')}.d.ts`), mainCode.replace(new RegExp(process.cwd(), 'g'), '.'), (err) => {
            if (err) {
              console.error(err);
            }
            mainCode = '';
          });
        }
      }
    }
  };
}

module.exports = createPlugin;
