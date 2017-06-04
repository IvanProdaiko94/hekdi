'use strict';
const EventEmitter = require('@nodeart/event_emitter');
const injector = require('../../../src/injector');

module.exports = injector.DIConfig.create({
  name: 'EventEmitterSingleton',
  resolutionStrategy: 'singleton',
  dependencies: [],
  value: EventEmitter
});
