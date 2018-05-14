/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const errors = require('./errors');

const resolveDependency = function(dependencyName, trace) {
  const config = this.getConfigOf(dependencyName);
  if (config === undefined) {
    throw new ReferenceError(errors.unmetDependency(this.belongTo.name, dependencyName));
  } else if (trace.includes(dependencyName)) {
    trace.push(dependencyName);
    throw new Error(errors.circularDependency(this.belongTo.name, dependencyName, trace));
  }
  trace.push(dependencyName);
  const mayHaveDeps = ['service', 'factory', 'singleton'].includes(config.strategy);
  let d;
  if (mayHaveDeps) {
    const deps = (config.value.$inject || []).map(name => this.getConfigOf(name).resolver(trace));
    const isFactory = config.strategy === 'factory';
    d = isFactory ? config.value(...deps) : new config.value(...deps);
  } else {
    d = config.value;
  }
  trace.pop();
  return d;
};

module.exports = {
  /**
   * creates a new instance each time with `new` keyword
   * Explanation https://codeburst.io/javascript-for-beginners-the-new-operator-cee35beb669e
   * @param dependencyName {string}
   */
  service: dependencyName => function(trace) {
    return resolveDependency.call(this, dependencyName, trace);
  },
  /**
   * return the result of plain function call
   * @param dependencyName
   */
  factory: dependencyName => function(trace) {
    return resolveDependency.call(this, dependencyName, trace);
  },
  /**
   * return the same instance of constructor each time
   * @param dependencyName {string}
   */
  singleton: (dependencyName) => {
    let instance;
    return function(trace) {
      if (!instance) {
        instance = resolveDependency.call(this, dependencyName, trace);
      }
      return instance;
    };
  },
  /**
   * return link on the of the value
   * @param dependencyName {string}
   */
  value: dependencyName => function(trace) {
    return resolveDependency.call(this, dependencyName, trace);
  },
  /**
   * return link on the of the value
   * @param dependencyName {string}
   */
  constant: dependencyName => function(trace) {
    return resolveDependency.call(this, dependencyName, trace);
  },
  /**
   * return other dependency by using value as a name
   * @param dependencyName {string}
   */
  alias: dependencyName => function(trace) {
    const { value } = this.getConfigOf(dependencyName);
    return resolveDependency.call(this, value, trace);
  }
};
