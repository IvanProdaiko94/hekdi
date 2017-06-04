'use strict';

module.exports = {
  configPropUnmet: key => `Required property '${key}' is unmet`,
  dependencyIsRegistered: dependencyName => `${dependencyName} is registered already`,
  incorrectConfigInstance: name => `Dependency must be an instance of ${name}`,
  unmetDependency: dependencyName => `Unmet dependency '${dependencyName}'`,
  selfDependency: dependencyName => `'${dependencyName}' can't be a dependency of itself`,
  incorrectResolutionStrategy: (resolutionStrategy, resolvers) => (
    `ResolutionStrategy ${resolutionStrategy} is incorrect. Allowable values are ${Object.keys(resolvers).join(', ')}`
  )
};
