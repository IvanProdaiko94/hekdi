'use strict';
const Injector = require('../../src/injector');

class Y {
  static get $inject() {
    return ['Dependency'];
  }
}

module.exports = Injector.DIConfig.create({
  name: 'DependencyInDir',
  resolutionStrategy: 'singleton',
  value: Y
});
