'use strict';
const DependencyConfig = require('./config');
const errors = require('./errors');

const inject = function(dependencyName) {
  const config = this.getConfigOf(dependencyName);
  return new config.value(...(config.dependencies || []).map(name => this.resolve(name)));
};

const strategies = {
  /**
   * creates a new instance each time
   * @param dependencyName {string}
   */
  factory: dependencyName => function() {
    return inject.call(this, dependencyName);
  },
  /**
   * return the same instance of constructor each time
   * @param dependencyName {string}
   */
  singleton: dependencyName => {
    let instance;
    return function() {
      if (!instance) {
        instance = inject.call(this, dependencyName);
      }
      return instance;
    };
  },
  /**
   * return link on the of the value
   * @param dependencyName {string}
   */
  value: dependencyName => function() {
    return this.getConfigOf(dependencyName).value;
  },
  /**
   * return link on the of the value
   * @param dependencyName {string}
   */
  constant: dependencyName => function() {
    return this.getConfigOf(dependencyName).value;
  }

};

class Injector {
  static get DIConfig() { return DependencyConfig; }

  constructor() {
    Object.defineProperties(this, {
      dependencies: { value: new Map(), enumerable: true },
      resolvers: { value: new Map(), enumerable: true }
    });
  }

  /**
   * @param dependencyName {String}
   * @return {any}
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
      const deps = config.dependencies || [];
      const dConf = this.getConfigOf(config.name);
      if (dConf && dConf.resolutionStrategy === 'constant') {
        throw new Error(errors.dependencyIsRegistered(config.name));
      } else if (!strategies.hasOwnProperty(config.resolutionStrategy)) {
        throw new Error(errors.incorrectResolutionStrategy(config.resolutionStrategy, strategies));
      } else if (deps.indexOf(config.name) !== -1) {
        throw new Error(errors.selfDependency(config.name));
      }
      deps.forEach(dep => {
        if (this.dependencies.has(dep)) {
          const depsToCheck = this.getConfigOf(dep).dependencies || [];
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
   */
  getConfigOf(dependencyName) {
    return this.dependencies.get(dependencyName);
  }
}

module.exports = Injector;
