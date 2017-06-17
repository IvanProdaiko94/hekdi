'use strict';
const EventEmitter = require('@nodeart/event_emitter');
const Injector = require('../src/injector-node');
const injector = new Injector();

const isWindows = process.platform === 'win32';

injector.bootstrap([`.${isWindows ? '\\' : '/'}`], true);

const x = Injector.DIConfig.create({
  name: 'X',
  resolutionStrategy: 'factory',
  dependencies: ['events', 'Y'],
  value: class X {
    constructor(events, y) {
      this.y = y;
      this.events = events;
    }
  }
});

const y = Injector.DIConfig.create({
  name: 'Y',
  resolutionStrategy: 'factory',
  value: class Y {
    constructor() {}
  }
});

injector.register(x, y);
injector.register(Injector.DIConfig.create({
  name: 'events',
  resolutionStrategy: 'singleton',
  value: EventEmitter
}));
injector.resolve('X');

console.log(injector);
