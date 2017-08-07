'use strict';
const Module = require('./module');

let app;

class App {
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

  static createApp() {
    if (!app) app = new App();
    return app;
  }
}

module.exports = App.createApp;
