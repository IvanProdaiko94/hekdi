'use strict';
const Injector = require('../../src/injector');

class Y { }

module.exports = Injector.DIConfig.create({
  name: 'DependencyInDir',
  resolutionStrategy: 'singleton',
  dependencies: ['Dependency'],
  value: Y
});
