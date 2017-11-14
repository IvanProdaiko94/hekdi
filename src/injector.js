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
  this.resolutionTrace = [];
}

/**
 * @param dependencyName {String}
 * @return {*}
 */
Injector.prototype.resolve = function(dependencyName) {
  if (this.dependencies.has(dependencyName)) {
    try {
      const dependency = this.getConfigOf(dependencyName).resolver();
      this.resolutionTrace = [];
      return dependency;
    } catch (message) {
      throw new Error(errors.circularDependency(this.belongTo.name, dependencyName, message));
    }
  }
  throw new ReferenceError(errors.unmetDependency(this.belongTo.name, dependencyName));
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
  const providers = [];
  dependencies = dependencies.filter(config => {
    if (config.strategy === 'provider') {
      providers.push(config);
      return false;
    }
    return true;
  });

  const providersValues = providers.map(provider => {
    const dConf = provider.value();
    if (dConf.strategy === 'provider') {
      throw new Error(errors.providerDoNotRegisterProviders(provider.name));
    }
    return dConf;
  });

  if (providersValues.length > 0) {
    this.register(...providersValues);
  }

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
