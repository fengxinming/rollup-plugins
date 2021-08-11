'use strict';

const { join, relative } = require('path');
const { emptyDirSync, removeSync } = require('fs-extra');
const globby = require('globby');
const { getLogger } = require('clrsole');

const logger = getLogger('rollup-plugin-empty');
const { isArray } = Array;
module.exports = function (conf) {
  conf = conf || {};

  const { silent } = conf;
  let { file, dir, glob } = conf;
  glob = Object.assign({ cwd: process.cwd(), absolute: true }, glob);
  file = file && globby.sync(file, glob);
  dir = !isArray(dir) ? [dir] : dir;

  const { cwd } = glob;

  return {
    name: 'empty',

    buildStart() {
      if (isArray(file)) {
        file.forEach((f) => {
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
