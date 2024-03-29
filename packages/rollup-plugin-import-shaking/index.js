'use strict';

const { EOL } = require('os');
const { readFile } = require('fs');
const { promisify } = require('util');
const { init, parse } = require('es-module-lexer');

const { isArray } = Array;
const readFileAsync = promisify(readFile);

/**
 * 驼峰逆转换
 * Convert a camelized name into a lowercased name
 *
 * @param {string} name
 * @returns {string}
 */
function decamelize(name) {
  return name.replace(/[A-Z]/g, (match, index) => {
    return `${index > 0 ? '-' : ''}${match.toLowerCase()}`;
  });
}

function defaultImportModule(namedExport, pkgName) {
  return `${pkgName}/es/${decamelize(namedExport)}`;
}

function defaultImportStyle(namedExport, pkgName) {
  return `${pkgName}/es/${decamelize(namedExport)}/style`;
}

/**
 * 处理命名导出的模块
 * process named export modules
 *
 * @param {string} pkgName
 * @param {Node[]} specifiers
 * @param {object} lib
 * @returns
 */
function processModules(pkgName, specifiers, lib) {
  const { importModule, importStyle } = lib;

  let newImportDeclarationStr = '';
  for (const specifier of specifiers) {
    switch (specifier.type) {
      case 'ImportDefaultSpecifier':
        newImportDeclarationStr += `import ${specifier.local.name} from "${pkgName}";${EOL}`;
        break;

      case 'ImportSpecifier': {
        const importedName = specifier.imported.name;
        const moduleName = importModule ? importModule(importedName, pkgName) : pkgName;
        newImportDeclarationStr += `import ${importedName} from "${moduleName}";${EOL}`;

        if (importStyle) {
          newImportDeclarationStr += `import "${importStyle(importedName, pkgName)}";${EOL}`;
        }
        break;
      }
    }
  }

  return newImportDeclarationStr;
}

async function transform(src, libs) {
  await init;

  const [imports] = parse(src);
  // n: package name
  // s: start
  // e: end
  // ss: statement start
  // se: statement end
  // d: dynamic import
  // a: assert

  let dest = src;
  for (const { n: pkgName, ss: startIndex, se: endIndex } of imports) {
    // 申明语句字符串 Statement string
    const importStr = src.substring(startIndex, endIndex);

    // 忽略异常import申明语句 Ignore invalid import declaration
    if (importStr.startsWith('import(')) {
      continue;
    }

    // 抽象语法树对象 AST Node object
    const ast = this.parse(importStr);

    const { specifiers, type } = ast.body[0];

    // 只处理import语法 Only ImportDeclaration
    if (type !== 'ImportDeclaration') {
      continue;
    }

    // matched package name
    const currentLib = libs[pkgName];
    if (!currentLib) {
      continue;
    }

    // 处理模块 Process modules if it is valid
    const newImportStr = processModules(pkgName, specifiers, currentLib);

    if (newImportStr) {
      dest = dest.replace(importStr, newImportStr.slice(0, -2));
    }
  }
  return dest;
}

function importShaking({ modules = [], hook } = {}) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return;
  }

  const libs = {};
  for (const lib of modules) {
    switch (typeof lib) {
      case 'string': // compat string definition
        libs[lib] = {
          name: lib,
          importModule: defaultImportModule
        };
        break;
      case 'object':
        if (lib !== null) {
          let { importModule, importStyle } = lib;
          const { name } = lib;

          // new module path
          if (typeof importModule === 'undefined' || importModule === true) {
            importModule = defaultImportModule;
          }

          // import css
          if (importStyle === true) {
            importStyle = defaultImportStyle;
          }

          if (isArray(name)) {
            for (const n of name) {
              libs[n] = {
                name: n,
                importModule,
                importStyle
              };
            }
          }
          else {
            libs[name] = {
              name,
              importModule,
              importStyle
            };
          }
        }
        break;
    }
  }

  const config = {
    name: 'import-shaking'
  };

  switch (hook) {
    case 'load':
      config.load = async function (id) {
        if (!id.endsWith('.js') || !id.endsWith('.mjs')) {
          return null;
        }
        const src = await readFileAsync(id, 'utf8');
        return transform.call(this, src, libs);
      };
      break;
    case 'renderChunk':
      config.renderChunk = function (code) {
        return transform.call(this, code, libs);
      };
      break;
    default:
      config.transform = function (src, id) {
        if (id.endsWith('.html')) {
          return null;
        }
        return transform.call(this, src, libs);
      };
  }

  return config;
}

importShaking.decamelize = decamelize;
importShaking.createPlugin = importShaking;

module.exports = importShaking;
