# Dependency Injection

This module exposes a simple `Injector` class.

## Basic usage:

```javascript
const { Injector } = require('DI');
const injector = new Injector();
class X {
  constructor(a, b) {
    console.log(a, b);
  }
}

const depX = Injector.DIConfig.create({
  name: 'X',
  resolutionStrategy: 'factory',
  dependencies: ['a', 'b'],
  value: X
});

const depA = Injector.DIConfig.create({
  name: 'a',
  resolutionStrategy: 'value',
  value: 'A'
});

const depB = Injector.DIConfig.create({
  name: 'b',
  resolutionStrategy: 'constant',
  value: 'B'
});

const depC = Injector.DIConfig.create({
  name: 'c',
  resolutionStrategy: 'singleton',
  value: 'C'
});


injector.register(depX, depA, depC);
injector.resolve('X');

// A B
```

### There are **four** resolutionStrategies available:
- `factory` each time a new instance will be created.
- `singleton` only one instance will be created.
- `value` just will be returned.
- `constant` the same as `value` but can't be reassign.

### InjectorNode
Also `InjectorNode` class is available. It can be useful if you don't want to use `require` everywhere
in your code.
Just call a `bootstrap` method with the list of folders or files you'd like to register and `InjectorNode` do everything
else.
If module exports and instance of `DependencyConfig` class (which is the same to `Injector.DIConfig.create`) result
than it will be registered.
If you want a recursive search just pass `true` as a second argument to `bootstrap` method.

Usage:
```javascript
const { InjectorNode } = require('DI');
const injector = new InjectorNode();

injector.bootstrap([
  `.`,
  '../dependencies',
  '../dependency_file.js'
], true)
```