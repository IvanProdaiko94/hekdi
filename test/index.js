'use strict';
const Injector = require('../src/injector');
const injector = new Injector();

// console.log(__filename);

injector.bootstrapSync('./', true);

// injector.getConfigOf('X');