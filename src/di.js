'use strict';
const Module = require('./module');

class DI {
  constructor() {
    this.main = null;
  }

  module(moduleConfig) {
    if (!(moduleConfig instanceof Module)) {
      return Module.createModule(moduleConfig);
    }
    return moduleConfig;
  }

  bootstrap(moduleConfig) {
    this.main = this.module(moduleConfig);
  }

  resolve(dependencyName) {
    return this.main.injector.resolve(dependencyName);
  }

  static create() {
    return new DI();
  }

  static integrateWith(app) {
    DI.call(app);
    Object.assign(app, DI.prototype);
    return app;
  }
}

module.exports = DI;
