'use strict';
const injector = require('../src/injector');

class X { }

module.exports = injector.DIConfig.create({
  name: 'Dependency',
  resolutionStrategy: 'factory',
  value: X
});
