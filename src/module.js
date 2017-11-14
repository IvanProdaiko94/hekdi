'use strict';
const Injector = require('./injector');

/**
 *
 * @constructor
 * @param config <{
 *    name: string,
 *    [declarations]: Array<Object>,
 *    [imports]: Array<Module>,
 *    [exports]: Array<string>|string>
 * }>
 * @return Module <{name: string, injector: Injector, [exports]: Map}>
 */
function Module(config) {
  this.name = config.name;
  this.injector = new Injector(this);

  if (config.imports) {
    config.imports.forEach(importedModule => {
      if (importedModule.exports) {
        this.injector.addImports(importedModule.exports);
      }
    });
  }

  this.injector.register(...(config.declarations || []));

  if (config.exports) {
    const dependencies = this.injector.dependencies;
    if (config.exports === '*') {
      this.exports = new Map(dependencies);
    } else {
      this.exports = new Map();
      config.exports.forEach(dependencyName => {
        const dependencyConfig = this.injector.getConfigOf(dependencyName);
        if (dependencyConfig.belongTo.name === this.name) {
          this.exports.set(dependencyName, dependencyConfig);
        }
      });
    }
  }
}

Module.createModule = function(config) {
  return new Module(config);
};

module.exports = Module;
