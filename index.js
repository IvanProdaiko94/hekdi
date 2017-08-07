'use strict';

const Module = require('./src/module');

module.exports = {
  createApp: require('./src/app'),
  createModule: Module.createModule
};
