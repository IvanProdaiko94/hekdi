'use strict';

const Module = require('./src/module');

module.exports = {
  app: require('./src/app'),
  createModule: Module.createModule
};
