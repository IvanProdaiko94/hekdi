'use strict';
const injector = require('../../../src/injector');

module.exports = injector.DIConfig.create({
  name: 'DependencyInDirInDir2Test',
  resolutionStrategy: 'value',
  dependencies: ['Dependency'],
  value: {
    x: true,
    y: true
  }
});