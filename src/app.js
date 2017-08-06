'use strict';

class App {
  constructor() {
    this.modules = new Set();
  }

  module(moduleToBeRegistered) {
    this.modules.push(moduleToBeRegistered);
    if (this.modules.imports) {
      this.modules.push(...this.modules.imports);
    }
    return moduleToBeRegistered;
  }

  static createApp() {
    return new App();
  }
}

module.exports = App.createApp;
