'use strict';
const { statSync } = require('fs');
const { resolve, relative } = require('path');

const check = path => {

};

const bootstrap = (src, recursive, configClass) => {
  //src = //path.relative(__filename, path.resolve(src));
  // const isDir = fs.lstatSync(src);//.isDirectory()
  // console.log(resolve(src), typeof resolve(src))
  // console.log(statSync( ).isDirectory());
  // console.log({
  //   src,
  //   cwd: process.cwd(),
  //   resolve : resolve(src),
  //   relative: relative(__filename, resolve(src)),
  // });
  // const dependencies = [];
  return [];
};

const errors = {
  configPropUnmet: key => `Required property '${key}' is unmet`,
  dependencyIsRegistered: dependencyName => `${dependencyName} is registered already`,
  incorrectConfigInstance: name => `Dependency must be an instance of ${name}`,
  unmetDependency: dependencyName => `Unmet dependency '${dependencyName}'`,
  selfDependency: dependencyName => `'${dependencyName}' can't be a dependency of itself`,
  incorrectResolutionStrategy: (resolutionStrategy, resolvers) => (
    `ResolutionStrategy ${resolutionStrategy} is incorrect. Allowable values are ${Object.keys(resolvers).join(', ')}`
  )
};

module.exports = { bootstrap, errors };
