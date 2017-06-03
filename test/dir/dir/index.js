'use strict';
const EventEmitter = require('@nodeart/event_emitter');
const DependencyConfig = require('../../../src/injector').DependencyConfig;

module.exports = new DependencyConfig({
  name: 'EventEmitterFactory',
  resolutionStrategy: 'factory',
  dependencies: [],
  value: EventEmitter
});
