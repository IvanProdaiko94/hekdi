'use strict';
const DependencyConfig = require('../../src/injector').DependencyConfig;

class X { }

module.exports = new DependencyConfig({
  name: 'DependencyInDir',
  resolutionStrategy: 'singleton',
  dependencies: ['Dependency'],
  value: X
});