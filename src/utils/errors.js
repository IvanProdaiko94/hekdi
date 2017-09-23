'use strict';

module.exports = {
  dependencyIsRegistered: dependencyName => `${dependencyName} is registered already. Constant can not be reassigned`,
  unmetDependency: (moduleName, dependencyName) => `Unmet dependency '${dependencyName}' in module '${moduleName}'`,
  selfDependency: dependencyName => `'${dependencyName}' can't be a dependency of itself`,
  circularDependency: (main, dep) => `Circular dependency found in '${dep}' while registering '${main}'`,
  incorrectResolutionStrategy: (strategy, strategies) => (
    `strategy ${strategy} is incorrect. Allowable values are ${Object.keys(strategies).join(', ')}`
  ),
  providerDoNotRegisterProviders: providerName => `Providers may not register providers ${providerName}`
};
