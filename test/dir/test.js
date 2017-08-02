'use strict';
const Injector = require('../../src/injector');

class X {
  static get $inject() {
    return ['Dependency'];
  }
}

module.exports = Injector.DIConfig.create({
  name: 'DependencyInDirTest',
  resolutionStrategy: 'singleton',
  value: X
});
