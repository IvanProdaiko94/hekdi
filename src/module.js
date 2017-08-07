'use strict';
const Injector = require('./injector');

class Module {
  /**
   * @param config <{name: string, [declarations]: Array<Object>, [imports]: Array<Module>}, [exports]: Map|string>
   * @return Module <{name: string, injector: Injector, [exports]: Map}>
   */
  constructor(config) {
    this.name = config.name;
    this.injector = new Injector(this.name);

    if (config.imports) {
      config.imports.forEach(module => {
        if (module.exports) {
          this.injector.addImports(module.exports);
        }
      });
    }

    this.injector.register(config.declarations || []);

    if (config.exports) {
      const deps = this.injector.dependencies;
      if (config.exports === '*') {
        this.exports = new Map(deps);
      } else {
        this.exports = new Map();
        this.injector.dependencies.forEach((value, key) => {
          this.exports.set(key, value);
        });
      }
    }
  }

  static createModule(config) {
    return new Module(config);
  }
}

module.exports = Module;
