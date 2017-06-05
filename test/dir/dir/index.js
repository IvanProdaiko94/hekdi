'use strict';
const EventEmitter = require('@nodeart/event_emitter');
const Injector = require('../../../src/injector');

module.exports = Injector.DIConfig.create({
  name: 'EventEmitterFactory',
  resolutionStrategy: 'factory',
  dependencies: [],
  value: EventEmitter
});
