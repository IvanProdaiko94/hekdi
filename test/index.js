'use strict';
const EventEmitter = require('@nodeart/event_emitter');
const Injector = require('../src/injector-node');
const injector = new Injector();

injector.bootstrap(['C:\\OpenSource\\Injector\\test'], true);

const x = Injector.DIConfig.create({
  name: 'X',
  resolutionStrategy: 'factory',
  dependencies: ['events', 'Y'],
  value: class X {
    constructor(events, y) {
      this.y = y;
      this.events = events;
      console.log(this);
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

injector.register(x);
injector.register(y);
injector.register(Injector.DIConfig.create({
  name: 'events',
  resolutionStrategy: 'singleton',
  value: EventEmitter
}));
injector.resolve('X');