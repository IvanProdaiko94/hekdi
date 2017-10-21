'use strict';
const errors = require('./utils/errors');
const strategies = require('./utils/strategies');
const resolutionChecker = require('./utils/resolution_checker');

/**
 *
 * @param moduleName {string}
 * @constructor
 */
function Injector(moduleName) {
  this.belongTo = moduleName;
  this.dependencies = new Map();
}

/**
 * @param dependencyName {String}
 * @return {*}
 */
Injector.prototype.resolve = function(dependencyName) {
  if (this.dependencies.has(dependencyName) && resolutionChecker.call(this, null, dependencyName)) {
    return this.dependencies.get(dependencyName).resolver();
  }
  throw new ReferenceError(errors.unmetDependency(this.belongTo, dependencyName));
};

/**
 * @param dependencies {Map}
 */
Injector.prototype.addImports = function(dependencies) {
  dependencies.forEach((dependencyConfig, key) => {
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
