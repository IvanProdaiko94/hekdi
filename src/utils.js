'use strict';
const { lstatSync, readdirSync } = require('fs');
const { resolve, relative, extname } = require('path');

const check = path => {

};

// module.exports = readdirSync(__dirname).reduce((acum, file) => {
//   if (file !== 'index.js') {
//     let module = require(`./${file}`);
//     acum.set(module.url, module.fn);
//   }
//   return acum;
// }, new Map());

const bootstrap = (src, recursive, configClass, modules) => {
  const stat = lstatSync(src);
  if (stat.isDirectory() && recursive) {
    const dir = readdirSync(src);
    console.log('dir', dir);
    dir.map(fName => bootstrap(src + '\\' + fName, recursive, configClass, modules));
  } else if (stat.isFile() && extname(src) === '.js') {
    console.log('file');
    const module = require(src);
    if (module instanceof configClass) {
      modules.push(module);
    }
  }
  return modules;
};

//const bootstrap = (src, recursive, configClass) => collector(src, recursive, configClass, []);

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
