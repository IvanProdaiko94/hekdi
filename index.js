'use strict';

const Module = require('./src/module');

module.exports = {
  DI: require('./src/di'),
  createModule: Module.createModule,
  koaDI: require('./src/frameworks/koa')
};
