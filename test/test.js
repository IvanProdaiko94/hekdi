'use strict';
const Injector = require('../src/injector');

class X { }

module.exports = Injector.DIConfig.create({
  name: 'Dependency',
  resolutionStrategy: 'factory',
  value: X
});
