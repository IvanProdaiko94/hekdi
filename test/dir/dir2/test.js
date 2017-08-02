'use strict';
const Injector = require('../../../src/injector');

module.exports = Injector.DIConfig.create({
  name: 'DependencyInDirInDir2Test',
  resolutionStrategy: 'value',
  value: {
    x: true,
    y: true
  }
});
