'use strict';

class App {
  constructor() {
    this.modules = [];
  }

  module(moduleToBeRegistered) {
    this.modules.push(moduleToBeRegistered);
    if (this.modules.imports) {
      this.modules.push(...this.modules.imports);
    }
    return moduleToBeRegistered;
  }
}

