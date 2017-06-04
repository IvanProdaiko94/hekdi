'use strict';
const EventEmitter = require('@nodeart/event_emitter');
const injector = require('../../../src/injector');

module.exports = injector.DIConfig.create({
  name: 'EventEmitterFactory',
  resolutionStrategy: 'factory',
  dependencies: [],
  value: EventEmitter
});
