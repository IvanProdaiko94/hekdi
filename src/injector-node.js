'use strict';
const { lstatSync, readdirSync } = require('fs');
const { extname, join } = require('path');
const DependencyConfig = require('./config');
const Injector = require('./injector');

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
      dir.map(fName => bootstrap(join(src, fName), recursive, configClass, modules));
    } else {
      dir.forEach(fName => {
        if (extname(fName) === '.js') {
          addModule(join(src, fName), configClass, modules);
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
   * @param sources {Array<String>} relative to launch file paths
   * @param recursive {Boolean}
   */
  bootstrap(sources, recursive) {
    sources.forEach(
      src => bootstrap(join(process.cwd(), src), recursive, DependencyConfig, [])
        .forEach(dependency => this.register(dependency))
    );
  }
}

module.exports = InjectorNode;
