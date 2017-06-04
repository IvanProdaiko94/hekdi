'use strict';
const Injector = require('../src/injector');
const injector = new Injector();

injector.bootstrap('C:\\OpenSource\\Injector\\test', true);
console.log(injector);