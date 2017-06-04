'use strict';
const injector = require('../../src/injector');

class X { }

module.exports = injector.DIConfig.create({
  name: 'DependencyInDirTest',
  resolutionStrategy: 'singleton',
  dependencies: ['Dependency'],
  value: X
});