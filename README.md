[![Build Status](https://travis-ci.org/IvanProdaiko94/hekdi.svg?branch=master)](https://travis-ci.org/IvanProdaiko94/hekdi)
[![bitHound Overall Score](https://www.bithound.io/github/IvanProdaiko94/hekdi/badges/score.svg)](https://www.bithound.io/github/IvanProdaiko94/hekdi)
[![bitHound Dependencies](https://www.bithound.io/github/IvanProdaiko94/hekdi/badges/dependencies.svg)](https://www.bithound.io/github/IvanProdaiko94/hekdi/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/IvanProdaiko94/hekdi/badges/code.svg)](https://www.bithound.io/github/IvanProdaiko94/hekdi)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/hekdi)
[![npm](https://img.shields.io/npm/dt/express.svg)](https://www.npmjs.com/package/hekdi)


# node.js Dependency Injection
This module provides dependency injection for node.js

```bash
npm i hekdi
```

## `hekdi` popular frameworks integration:

- [Express](./docs/express.md) 
- [Koa](./examples/koa.js) 
- [Hapi](./examples/hapi.js)

## Basic usage:

```javascript
// imported.module.js
const { createModule } = require('hekdi');

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
// main.module.js
const { createModule } = require('hekdi');
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
const { DI } = require('hekdi');
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
const { DI } = require('hekdi');
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
const { createModule } = require('hekdi');

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