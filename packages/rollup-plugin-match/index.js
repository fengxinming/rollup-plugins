'use strict';

const globby = require('globby');

module.exports = function (conf) {
  conf = Object.assign({ cwd: process.cwd(), absolute: true }, conf);

  return {
    name: 'match',

    options(options) {
      const { input } = options;

      options.input = globby.sync(input, conf);
    }
  };
};
