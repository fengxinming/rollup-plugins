'use strict';

const { EOL } = require('os');
const { init, parse } = require('es-module-lexer');

const { isArray } = Array;

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

function matchPkgName(name, pkgName) {
  return isArray(name)
    ? name.indexOf(pkgName) > -1
    : name === pkgName;
}

/**
 * 处理命名导出的模块
 * process named export modules
 *
 * @param {string} pkgName
 * @param {Node[]} specifiers
 * @param {object[]} modules
 * @returns
 */
function processModules(pkgName, specifiers, modules) {
  // module shaking
  if (modules) {
    for (let lib of modules) {
      // compat string definition
      if (typeof lib === 'string') {
        lib = { name: lib };
      }

      // matched package name
      if (matchPkgName(lib.name, pkgName)) {
        let { importModule, importStyle } = lib;

        // new module path
        if (typeof importModule === 'undefined' || importModule === true) {
          importModule = defaultImportModule;
        }

        // import css
        if (importStyle === true) {
          importStyle = defaultImportStyle;
        }

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
    }
  }
}

function importShaking({ modules = [] } = {}) {
  if (!Array.isArray(modules) || modules.length === 0) {
    return;
  }

  // let config;

  return {
    name: 'import-shaking',

    async transform(src, id) {
      if (id.endsWith('.html')) {
        return;
      }

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
          return;
        }

        // 处理模块 Process modules if it is valid
        const newImportStr = processModules(pkgName, specifiers, modules);

        if (newImportStr) {
          dest = dest.replace(importStr, newImportStr.slice(0, -2));
        }
      }
      return dest;
    }
  };
}

importShaking.decamelize = decamelize;
importShaking.createPlugin = importShaking;

module.exports = importShaking;
