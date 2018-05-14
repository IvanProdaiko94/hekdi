'use strict';
const Module = require('./module');

function DI() {
  this.main = null;
}

DI.prototype.module = function(moduleConfig) {
  return moduleConfig instanceof Module ? moduleConfig : Module.createModule(moduleConfig);
};

DI.prototype.bootstrap = function(moduleConfig) {
  this.main = this.module(moduleConfig);
};

DI.prototype.resolve = function(dependencyName) {
  return this.main.injector.resolve(dependencyName);
};

DI.create = function() {
  return new DI();
};

DI.integrateWith = function(app) {
  DI.call(app);
  Object.assign(app, DI.prototype);
  return app;
};

module.exports = DI;
