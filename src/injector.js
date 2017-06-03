'use strict';
const DependencyConfig = require('./config');
const Boot = require('./bootstrap');

const afterBootstrap = function(dependencies = []) {
  dependencies.forEach(dependency => this.register(
      dependency.name,
      dependency.config
    )
  );
  return this;
};

class Injector {
  static get DependencyConfig() { return DependencyConfig; }

  constructor() {
    Object.defineProperty(this, 'dependencies', { value: new Map() });
  }

  resolve() {

  }

  register(dependency) {
    if (this.dependencies.has(dependency.name)) {
      throw new Error(`${dependency.name} already registered`);
    }
    return this;
  }

  /**
   * @param src
   * @type String
   * @param recursive
   * @type Boolean
   */
  bootstrapSync(src, recursive) {
    return afterBootstrap.apply(this, Boot.bootstrapSync(src, recursive));
  }

  /**
   * @param src
   * @type String
   * @param recursive
   * @type Boolean
   */
  bootstrap(src, recursive) {
    return Boot
      .bootstrap(src, recursive)
      .then(afterBootstrap.bind(this));
  }

  /**
   * @param dependencyName {String}
   */
  getConfigOf(dependencyName) {
    return this.dependencies.get(dependencyName);
  }
}

module.exports = Injector;
