'use strict';
const DependencyConfig = require('./config');
const errors = require('./errors');
const strategies = require('./utils/stratagies');

class Injector {
  static get DIConfig() { return DependencyConfig; }
  static createInjector() { return new Injector(); }

  constructor() {
    Object.defineProperties(this, {
      dependencies: { value: new Map(), enumerable: true },
      resolvers: { value: new Map(), enumerable: true }
    });
  }

  /**
   * @param dependencyName {String}
   * @return {*}
   */
  resolve(dependencyName) {
    if (this.resolvers.has(dependencyName)) {
      return this.resolvers.get(dependencyName)();
    } else {
      throw new Error(errors.unmetDependency(dependencyName));
    }
  }

  /**
   * @param dependencies {Array<DependencyConfig>|DependencyConfig}
   * @return {Injector}
   */
  register(...dependencies) {
    dependencies.forEach(dependency => {
      const config = dependency.config;
      const inject = config.value.$inject || [];
      const dConf = this.getConfigOf(config.name);
      if (dConf && dConf.resolutionStrategy === 'constant') {
        throw new Error(errors.dependencyIsRegistered(config.name));
      } else if (!strategies.hasOwnProperty(config.resolutionStrategy)) {
        throw new Error(errors.incorrectResolutionStrategy(config.resolutionStrategy, strategies));
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
      this.resolvers.set(config.name, strategies[config.resolutionStrategy](config.name).bind(this));
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

module.exports = Injector.createInjector;
