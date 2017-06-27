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
  dependencies: ['eventEmitter', 'Y', 'events'],
  value: class X {
    constructor(events, y, eventsAlias) {
      this.y = y;
      this.events = events;
      this.eventsAlias = eventsAlias;
      assert.deepEqual(
        this.events,
        this.eventsAlias,
        'Alias test fail'
      );
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
  alias: 'events',
  resolutionStrategy: 'singleton',
  value: EventEmitter
});

injector.register(x, y, eventEmitter);

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
