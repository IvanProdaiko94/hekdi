'use strict';
const { createInjector } = require('./injector');

class Module {
  constructor(config) {
    this.declarations = config.declarations;
    this.imports = new Set(config.imports);
    this.injector = createInjector();
  }

  static createModule(config) {
    return new Module(config);
  }
}

module.exports = Module.createModule;
