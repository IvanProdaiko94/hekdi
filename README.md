[![TravisCI](https://travis-ci.org/IvanProdaiko94/Injector.svg?branch=master)](https://travis-ci.org/IvanProdaiko94/Injector)

# Dependency Injection

This module provides dependency injection for browser and node.

### There are **five** resolutionStrategies available:
- `factory` - each time a new instance will be created.
- `singleton` - only one instance will be created.
- `value` - just will be returned.
- `constant` - the same as `value` but can't be reassign.
- `alias` - used to create an alias for some dependency.

## Basic usage:

```javascript
const { Injector } = require('@nodeart/injector');
const injector = new Injector();
class X {
  constructor(a, b) {
    console.log(a, b);
  }
  
  static get $inject() {
    return ['a', 'b'];
  }
}

const depX = Injector.DIConfig.create({
  name: 'X',
  strategy: 'factory',
  value: X
});

const depA = Injector.DIConfig.create({
  name: 'a',
  strategy: 'value',
  value: 'A'
});

const depB = Injector.DIConfig.create({
  name: 'b',
  strategy: 'constant',
  value: 'B'
});

const depC = Injector.DIConfig.create({
  name: 'c',
  strategy: 'singleton',
  value: 'C'
});

const alias = Injector.DIConfig.create({
  name: 'aliasForC',
  strategy: 'alias',
  value: 'C' // actual dependency
});



injector.register(depX, depA, depC);
injector.resolve('X');

// A B
```

## Node.js usage
Alongside with `Injector`, `InjectorNode` class is available. It inherits from `Injector` and in addition to 
main functionality it can search for modules inside file system.
It can be useful if you write a big node.js project and do not want to manage dependencies on your own.
Just call a `bootstrap` method with the list of folders or files you'd like to register and `InjectorNode` do everything
else for you. To be registered module must exports and instance of `DependencyConfig` class 
(which is the same as calling `Injector.DIConfig.create` method over an object).
If you want a recursive search just pass `true` as a second argument to `bootstrap` method.

```javascript
const { InjectorNode } = require('@nodeart/injector');
const injector = new InjectorNode();

injector.bootstrap([
  '.',
  '../dependencies',
  '../dependency_file.js'
], true);
```