'use strict';
const errors = require('./utils/errors');
const strategies = require('./utils/stratagies');

class Injector {
  /**
   * @param moduleName {string}
   */
  constructor(moduleName) {
    this.belongTo = moduleName;
    this.dependencies = new Map();
    this.resolvers = new Map();
  }

  /**
   * @param dependencyName {String}
   * @return {*}
   */
  resolve(dependencyName) {
    if (this.resolvers.has(dependencyName)) {
      return this.resolvers.get(dependencyName)();
    } else {
      throw new ReferenceError(errors.unmetDependency(this.belongTo, dependencyName));
    }
  }

  /**
   * @param resolvers {Map}
   */
  addImports(resolvers) {
    resolvers.forEach((value, key) => {
      this.resolvers.set(key, value);
    });
  }

  /**
   * @param dependencies {Array<Object>}
   * @return {Map}
   */
  register(dependencies) {
    dependencies.map(dependency => {
      const config = dependency.config;
      const inject = config.value.$inject || [];
      const dConf = this.getConfigOf(config.name);
      if (dConf && dConf.strategy === 'constant') {
        throw new Error(errors.dependencyIsRegistered(config.name));
      } else if (!strategies.hasOwnProperty(config.strategy)) {
        throw new Error(errors.incorrectResolutionStrategy(config.strategy, strategies));
      } else if (inject.indexOf(config.name) !== -1) {
        throw new Error(errors.selfDependency(config.name));
      }
      inject.forEach(dep => {
        if (this.dependencies.has(dep)) {
          const depsToCheck = this.getConfigOf(dep).value.$inject || [];
          if (depsToCheck.indexOf(config.name) !== -1) {
            throw new Error(errors.circularDependency(config.name, dep));
          }
        }
      });
      this.resolvers.set(config.name, strategies[config.strategy](config.name).bind(this));
      this.dependencies.set(config.name, config);
    });
  }

  /**
   * @param dependencyName {String}
   * @return {*}
   */
  getConfigOf(dependencyName) {
    return this.dependencies.get(dependencyName);
  }
}

module.exports = Injector;
