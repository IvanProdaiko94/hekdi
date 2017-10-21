'use strict';

module.exports = {
  dependencyIsRegistered: dependencyName => `${dependencyName} is registered already. Constant can not be reassigned`,
  unmetDependency: (moduleName, dependencyName) => `Unmet dependency '${dependencyName}' in module '${moduleName}'`,
  circularDependency: (list, dep) => `Circular dependency found while resolving ${dep}: ${list}`,
  incorrectResolutionStrategy: (strategy, strategies) => (
    `strategy ${strategy} is incorrect. Allowable values are ${Object.keys(strategies).join(', ')}`
  ),
  providerDoNotRegisterProviders: providerName => `Providers may not register providers ${providerName}`
};
