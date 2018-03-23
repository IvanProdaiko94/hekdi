/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const errors = require('./errors');

const resolveHelper = function(dependencyName) {
  if (this.dependencies.has(dependencyName)) {
    return this.getConfigOf(dependencyName).resolver();
  }
  throw new ReferenceError(errors.unmetDependency(this.belongTo.name, dependencyName));
};

const resolveDependency = function(dependencyName, strategy) {
  const config = this.getConfigOf(dependencyName);
  if (this.resolutionTrace.indexOf(dependencyName) !== -1) {
    this.resolutionTrace.push(dependencyName);
    throw {
      moduleName: this.belongTo.name,
      resolutionTrace: this.resolutionTrace
    };
  }
  this.resolutionTrace.push(dependencyName);
  const deps = (config.value.$inject || []).map(name => resolveHelper.call(this, name));
  const isFactory = strategy === 'factory';
  const d = isFactory ? config.value(...deps) : new config.value(...deps);
  this.resolutionTrace.pop();
  return d;
};

module.exports = {
  /**
   * creates a new instance each time with `new` keyword
   * Explanation https://codeburst.io/javascript-for-beginners-the-new-operator-cee35beb669e
   * @param dependencyName {string}
   */
  service: dependencyName => function() {
    return resolveDependency.call(this, dependencyName, 'service');
  },
  /**
   * return the result of plain function call
   * @param dependencyName
   */
  factory: dependencyName => function() {
    return resolveDependency.call(this, dependencyName, 'factory');
  },
  /**
   * return the same instance of constructor each time
   * @param dependencyName {string}
   */
  singleton: dependencyName => {
    let instance;
    return function() {
      if (!instance) {
        instance = resolveDependency.call(this, dependencyName, 'singleton');
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
  },
  /**
   * return other dependency by using value as a name
   * @param dependencyName {string}
   */
  alias: dependencyName => function() {
    const { value } = this.getConfigOf(dependencyName);
    const { name } = this.getConfigOf(value);
    return resolveHelper.call(this, name);
  }
};
