'use strict';
const assert = require('assert');

const EventEmitter = require('@nodeart/event_emitter');
const InjectorNode = require('../src/injector-node');
const injector = new InjectorNode();

injector.bootstrap(['./test'], true);

const x = InjectorNode.DIConfig.create({
  name: 'X',
  resolutionStrategy: 'factory',
  value: class X {
    constructor(events, y) {
      this.y = y;
      this.events = events;
    }

    static get $inject() {
      return ['eventEmitter', 'Y'];
    }
  }
});

const y = InjectorNode.DIConfig.create({
  name: 'Y',
  resolutionStrategy: 'factory',
  value: class Y { }
});

const eventEmitter = InjectorNode.DIConfig.create({
  name: 'eventEmitter',
  resolutionStrategy: 'singleton',
  value: EventEmitter
});

injector.register(x, y, eventEmitter);
injector.register(InjectorNode.DIConfig.create({
  name: 'events',
  resolutionStrategy: 'alias',
  value: 'eventEmitter'
}));
assert.equal(injector.dependencies.size, 10, 'There must be 10 dependencies inside');
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
assert.deepEqual(
  injector.resolve('eventEmitter'),
  injector.resolve('events'),
  'Resolution strategy `alias` ' +
  'should return instance of `eventEmitter` and as far as it is singleton, ' +
  'there should be one instance'
);
console.log('All tests passed successfully');