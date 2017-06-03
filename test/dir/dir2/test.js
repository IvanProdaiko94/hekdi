'use strict';
const DependencyConfig = require('../../../src/injector').DependencyConfig;

module.exports = new DependencyConfig({
  name: 'DependencyInDirInDir2Test',
  resolutionStrategy: 'value',
  dependencies: ['Dependency'],
  value: {
    x: true,
    y: true
  }
});