'use strict';

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
      'dependencies': false,
      'value': false
    };
    Object.keys(config).forEach(key => {
      if (requiredProps.hasOwnProperty(key)) {
        requiredProps[key] = true;
      }
    });
    Object.keys(requiredProps).forEach(key => {
      if (requiredProps[key] === false) {
        throw new Error(`Required property is ${requiredProps[key]} unmet`);
      }
    });
    this.name = config.name;
    this.config = config;
  }
}

module.exports = DependencyConfig;
