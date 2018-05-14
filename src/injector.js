'use strict';
const errors = require('./utils/errors');
const strategies = require('./utils/strategies');

/**
 *
 * @param module {Module}
 * @constructor
 */
function Injector(module) {
  this.belongTo = module;
  this.dependencies = new Map();
}

/**
 * @param dependencyName {String}
 * @return {*}
 */
Injector.prototype.resolve = function(dependencyName) {
  const trace = [];
  const config = this.getConfigOf(dependencyName);
  if (config === undefined) {
    throw new ReferenceError(errors.unmetDependency(this.belongTo.name, dependencyName));
  }
  return config.resolver(trace);
};

/**
 * @param dependencies {Map}
 */
Injector.prototype.addImports = function(dependencies) {
  dependencies.forEach((dependencyConfig, key) => {
    if (this.dependencies.has(key)) {
      console.warn(`Name collision happened while adding imports. ${key} is already exists in ${this.belongTo.name}`);
      return;
    }
    this.dependencies.set(key, dependencyConfig);
  });
};

/**
 * @param dependencies {Object<{name: string, strategy: string: value: any}>}
 * @return {Map}
 */
Injector.prototype.register = function(...dependencies) {
  dependencies.forEach(config => {
    const dConf = this.getConfigOf(config.name);
    if (dConf && dConf.strategy === 'constant') {
      throw new Error(errors.dependencyIsRegistered(config.name));
    } else if (!strategies.hasOwnProperty(config.strategy)) {
      throw new Error(errors.incorrectResolutionStrategy(config.strategy, strategies));
    }
    config.resolver = strategies[config.strategy](config.name).bind(this);
    config.belongTo = this.belongTo;
    this.dependencies.set(config.name, config);
  });
};

/**
 * @param dependencyName {String}
 * @return {*}
 */
Injector.prototype.getConfigOf = function(dependencyName) {
  return this.dependencies.get(dependencyName);
};

module.exports = Injector;
