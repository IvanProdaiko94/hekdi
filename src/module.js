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
      const resolvers = this.injector.resolvers;
      if (config.exports === '*') {
        this.exports = new Map(resolvers);
      } else {
        this.exports = new Map();
        this.injector.resolvers.forEach((value, key) => {
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
