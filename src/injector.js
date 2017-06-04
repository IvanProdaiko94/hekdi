'use strict';
const DependencyConfig = require('./config');
const { bootstrap, errors } = require('./utils');

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
   * @param dependency {DependencyConfig}
   * @return {Injector}
   */
  register(dependency) {
    const config = dependency.config;
    if (!(dependency instanceof DependencyConfig)) {
      throw new Error(errors.incorrectConfigInstance(DependencyConfig.name));
    } else if (this.dependencies.has(config.name)) {
      throw new Error(errors.dependencyIsRegistered(config.name));
    } else if (!strategies.hasOwnProperty(config.resolutionStrategy)) {
      throw new Error(errors.incorrectResolutionStrategy(config.resolutionStrategy, strategies));
    } else if ((config.dependencies || []).indexOf(config.name) !== -1) {
      throw new Error(errors.selfDependency(config.name));
    }
    this.resolvers.set(config.name, strategies[config.resolutionStrategy](config.name).bind(this));
    this.dependencies.set(config.name, config);
  }

  /**
   * @param src {String}
   * @param recursive {Boolean}
   */
  bootstrap(src, recursive) {
    bootstrap(src, recursive, DependencyConfig)
      .forEach(dependency => {
        if (dependency instanceof DependencyConfig) {
          this.register(dependency);
        }
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
