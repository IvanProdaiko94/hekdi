[![Build Status](https://travis-ci.org/IvanProdaiko94/node-DI.svg?branch=master)](https://travis-ci.org/IvanProdaiko94/node-DI)
[![bitHound Overall Score](https://www.bithound.io/github/IvanProdaiko94/node-DI/badges/score.svg)](https://www.bithound.io/github/IvanProdaiko94/node-DI)
[![bitHound Dependencies](https://www.bithound.io/github/IvanProdaiko94/node-DI/badges/dependencies.svg)](https://www.bithound.io/github/IvanProdaiko94/node-DI/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/IvanProdaiko94/node-DI/badges/code.svg)](https://www.bithound.io/github/IvanProdaiko94/node-DI)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

# node.js Dependency Injection
This module provides dependency injection for node.js

```bash
npm i node-DI
```

## Basic usage:

```javascript
// imported.module.js
const { createModule } = require('node-DI');

class Dependency1 {
  constructor() {
    this.name = 'Dependency1';
  }
}

class Dependency2 {
  static get $inject() {
    return ['LocalDependency'];
  }

  constructor(d1) {
    this.name = 'Dependency2';
    this.d1 = d1;
  }
}

module.exports = createModule({
  name: 'ImportedModule',
  declarations: [
    { name: 'LocalDependency', strategy: 'singleton', value: Dependency1 },
    { name: 'PublicDependency', strategy: 'factory', value: Dependency2 },
    { name: 'Arr', strategy: 'value', value: [1, 2, 3] }
  ],
  exports: ['PublicDependency', 'Arr']
});
```

```javascript
// mail.module.js
const { createModule } = require('node-DI');
const importedModule = require('./imported.module');

class Ctrl {
  static get $inject() {
    return ['PublicDependency', 'Arr'];
  }

  constructor(publicDep, arr) {
    console.log(publicDep, arr);
  }
}

module.exports = createModule({
  name: 'SharedModule',
  declarations: [
    { name: 'Controller', strategy: 'singleton', value: Ctrl },
    { name: 'ControllerAs', strategy: 'alias', value: 'Controller' }
  ],
  imports: [ importedModule ]
})
```

```javascript
// app.js
const { DI } = require('node-DI');
const MainModule = require('./main.module');
const di = DI.create();

di.bootstrap(MainModule);

const ctrl = di.resolve('ControllerAs');
// Dependency2 { name: 'Dependency2', d1: Dependency1 { name: 'Dependency1' } } [ 1, 2, 3 ]
```

## Main concepts:

### Top level API:
Top level api is `DI` class that bootstraps main module and serves dependencies from it then.

```javascript
const { DI } = require('node-DI');
const di = DI.create();

di.module(moduleConfig) // creates new module from config

di.bootstrap(moduleConfig) // register module as main one and resolve dependencies from it

const dep = di.resolve('dependency') // return dependency that was registered to bootstrapped module according to its strategy
```

### Modularity:

DI provides modules as a structural unit of app.
- `declarations` array sets own dependencies of this module.
- `exports` array tells what dependencies are available for other modules
- `imports` array will inject exported members from other module to this one

```javascript
const { createModule } = require('node-DI');

createModule({
  name: 'SomeModule',
  declarations: [
    { name: 'LocalDependency', strategy: 'singleton', value: class X {} },
    { name: 'PublicDependency', strategy: 'factory', value: class Y {} },
    { name: 'Arr', strategy: 'value', value: [1, 2, 3] }
  ],
  exports: ['PublicDependency', 'Arr'], // if '*' set, module will export all of the dependencies including imported 
  imports: [ AnotherModuleInstance ]
});
// here 'LocalDependency' will be available for injection only for members of this module. 
```

### Strategies:
- `factory` - each time a new instance will be created.
- `singleton` - only one instance will be created.
- `value` - just will be returned.
- `constant` - the same as `value` but can't be reassign.
- `alias` - used to create an alias for some dependency.