'use strict';

const { posix: { join } } = require('path');
const globby = require('globby');

module.exports = function (conf) {
  const cwd = process.cwd();
  const opts = Object.assign({ cwd }, conf);

  return {
    options(options) {
      const { input } = options;
      options.input = globby
        .sync(input, opts)
        .map(n => join(cwd, n));
    }
  };
};
