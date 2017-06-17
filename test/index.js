'use strict';
const assert = require('assert');

const EventEmitter = require('@nodeart/event_emitter');
const InjectorNode = require('../src/injector-node');
const injector = new InjectorNode();

const isWindows = process.platform === 'win32';

injector.bootstrap([`.${isWindows ? '\\' : '/'}`], true);

const x = InjectorNode.DIConfig.create({
  name: 'X',
  resolutionStrategy: 'factory',
  dependencies: ['eventEmitter', 'Y'],
  value: class X {
    constructor(events, y) {
      this.y = y;
      this.events = events;
    }
  }
});

const y = InjectorNode.DIConfig.create({
  name: 'Y',
  resolutionStrategy: 'factory',
  value: class Y {
    constructor() {}
  }
});

injector.register(x, y);

injector.register(InjectorNode.DIConfig.create({
  name: 'eventEmitter',
  resolutionStrategy: 'singleton',
  value: EventEmitter
}));

assert.equal(injector.dependencies.size, 9, 'There must be 9 dependencies inside');
assert.deepEqual(
  injector.resolve('eventEmitter'),
  injector.resolve('eventEmitter'),
  'Resolution strategy `singleton` expects only one instance'
);
assert.notEqual(
  injector.resolve('X'),
  injector.resolve('X'),
  'Resolution strategy `factory` expects new instance on every resolution'
);
