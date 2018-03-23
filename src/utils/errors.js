'use strict';

module.exports = {
  dependencyIsRegistered: dependencyName => `${dependencyName} is registered already. Constant can not be reassigned`,
  unmetDependency: (moduleName, dependencyName) => `Unmet dependency '${dependencyName}' in module '${moduleName}'`,
  circularDependency: (moduleName, dependencyName, message) => `Circular dependency found in module '${moduleName}' while resolving ${dependencyName}! ${message.moduleName}: ${message.resolutionTrace.join(' -> ')}`,
  incorrectResolutionStrategy: (strategy, strategies) => (
    `strategy ${strategy} is incorrect. Allowable values are ${Object.keys(strategies).join(', ')}`
  )
};
