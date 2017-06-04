'use strict';
const injector = require('../../src/injector');

class Y { }

module.exports = injector.DIConfig.create({
  name: 'DependencyInDir',
  resolutionStrategy: 'singleton',
  dependencies: ['Dependency'],
  value: Y
});
