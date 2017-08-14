/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const inject = function(dependencyName) {
  const config = this.getConfigOf(dependencyName);
  return new config.value(...(config.value.$inject || []).map(name => this.resolve(name)));
};

module.exports = {
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
  },
  /**
   * return other dependency by using value as a name
   * @param dependencyName {string}
   */
  alias: dependencyName => function() {
    const { value } = this.getConfigOf(dependencyName);
    const { name } = this.getConfigOf(value);
    return this.resolve(name);
  }
};
