'use strict';
const DependencyConfig = require('../../src/injector').DependencyConfig;

class Y { }

module.exports = new DependencyConfig({
  name: 'DependencyInDir',
  resolutionStrategy: 'singleton',
  dependencies: ['Dependency'],
  value: Y
});