'use strict';

const { posix: { join, relative } } = require('path');
const { emptyDirSync, removeSync } = require('fs-extra');
const globby = require('globby');
const { getLogger } = require('clrsole');

const logger = getLogger('rollup-plugin-empty');
const { isArray } = Array;
module.exports = function (conf) {
  conf = conf || {};

  let { file, dir, glob, cwd, silent } = conf;
  cwd = cwd || process.cwd();
  file = file && globby.sync(file, Object.assign({ cwd }, glob));
  dir = !isArray(dir) ? [dir] : dir;

  return {
    name: 'empty',

    buildStart() {
      if (isArray(file)) {
        file.forEach((f) => {
          if (!f.startsWith('/')) {
            f = join(cwd, f);
          }
          removeSync(f);
          if (silent === false) {
            logger.info('删除文件:', relative(cwd, f));
          }
        });
      }
      dir.forEach((d) => {
        if (typeof d === 'string') {
          if (!d.startsWith('/')) {
            d = join(cwd, d);
          }
          emptyDirSync(d);
          if (silent === false) {
            logger.info('清空文件夹:', relative(cwd, d));
          }
        }
      });
    }
  };
};
