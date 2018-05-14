'use strict';

module.exports = {
  dependencyIsRegistered: dependencyName => `${dependencyName} is registered already. Constant can not be reassigned`,
  unmetDependency: (moduleName, dependencyName) => `Unmet dependency '${dependencyName}' in module '${moduleName}'`,
  circularDependency: (moduleName, dependencyName, trace) => (
    `Circular dependency found in module '${moduleName}' while resolving ${dependencyName}! Full path: ${trace.join(' -> ')}`
  ),
  incorrectResolutionStrategy: (strategy, strategies) => (
    `strategy ${strategy} is incorrect. Allowable values are ${Object.keys(strategies).join(', ')}`
  )
};
