'use strict';

const Module = require('./src/module');

module.exports = {
  DI: require('./src/di'),
  createModule: Module.createModule,
  expressDI: require('./src/frameworks/express')
};
