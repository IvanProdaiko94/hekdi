'use strict';
const { errors } = require('./utils');
/**
 * DependencyConfig
 */
class DependencyConfig {
  /**
   * @param config {Object} Config of dependency
   * @param config.name {String} The name of the dependency.
   * @param config.resolutionStrategy {String} The name of the user.
   * @param config.value {any} class or value to be resolved.
   * @param config.dependencies {Array<String>} Dependencies array required for dependency creation.
   */
  constructor(config) {
    const requiredProps = {
      'name': false,
      'resolutionStrategy': false,
      'value': false
    };
    Object.keys(config).forEach(key => {
      if (requiredProps.hasOwnProperty(key)) {
        requiredProps[key] = true;
      }
    });
    Object.keys(requiredProps).forEach(key => {
      if (requiredProps[key] === false) {
        throw new Error(errors.configPropUnmet(key));
      }
    });
    this.config = config;
  }

  static create(config) {
    return new DependencyConfig(config);
  }
}

module.exports = DependencyConfig;
