'use strict';
const { lstatSync, readdirSync } = require('fs');
const { extname } = require('path');
const DependencyConfig = require('./config');
const Injector = require('./injector');

const isWindows = process.platform === 'win32';

const addModule = (src, configClass, modules) => {
  const module = require(src);
  if (module instanceof configClass) {
    modules.push(module);
  }
};

const bootstrap = (src, recursive, configClass, modules) => {
  const stat = lstatSync(src);
  if (stat.isDirectory()) {
    const dir = readdirSync(src);
    if (recursive) {
      dir.map(fName => bootstrap(src + (isWindows ? '\\' : '/') + fName, recursive, configClass, modules));
    } else {
      dir.forEach(fName => {
        if (extname(fName) === '.js') {
          addModule(src + (isWindows ? '\\' : '/') + fName, configClass, modules);
        }
      });
    }
  } else if (stat.isFile() && extname(src) === '.js') {
    addModule(src, configClass, modules);
  }
  return modules;
};

class InjectorNode extends Injector {
  /**
   * @param srcs {Array<String>} Absolute path to src
   * @param recursive {Boolean}
   */
  bootstrap(srcs, recursive) {
    srcs.forEach(
      src => bootstrap(src, recursive, DependencyConfig, [])
        .forEach(dependency => this.register(dependency))
    );
  }
}

module.exports = InjectorNode;