'use strict';
const Module = require('./module');

let app;

class App {
  constructor() {
    this.main = null;
  }

  module(moduleConfig) {
    let newModule;
    if (!(moduleConfig instanceof Module)) {
      newModule = Module.createModule(moduleConfig);
    }
    return newModule;
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
