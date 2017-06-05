'use strict';
const Injector = require('../../src/injector');

class X { }

module.exports = Injector.DIConfig.create({
  name: 'DependencyInDirTest',
  resolutionStrategy: 'singleton',
  dependencies: ['Dependency'],
  value: X
});