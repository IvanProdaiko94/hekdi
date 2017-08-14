'use strict';

const express = require('express');
const { expressDI, createModule } = require('..');
const app = express();

class Ctrl {
  static get $inject() {
    return ['hello', 'world'];
  }
  constructor(s1, s2) {
    this.s1 = s1;
    this.s2 = s2;
  }

  next(req, res, next) {
    console.log('hi from middleware');
    next();
  }

  greet(req, res) {
    console.log('greet');
    console.log('\n');
    res.send(`${this.s1},${this.s2}`);
  }

  hi(req, res, next, data) {
    console.log('hi', data);
    console.log('\n');
    res.send(`${this.s1} there`);
  }
}

const servicesModule = createModule({
  name: 'ServicesModule',
  declarations: [
    { name: 'hello', strategy: 'value', value: 'Hello' },
    { name: 'world', strategy: 'value', value: 'World' },
  ],
  exports: '*'
});

const di = expressDI.create(app, {
  '/api': {
    'get': {
      controller: 'Controller',
      fn: 'hi',
      data: ['args']
    }
  },
  '/api/:test': {
    'get': {
      controller: 'Controller',
      fn: 'greet',
      middlewares: [
        (req, res, next) => {
          console.log('from middleware');
          next();
        }, {
          controller: 'Controller',
          fn: 'next'
        }
      ],
      data: ['args']
    },
  }
});

di.bootstrap({
  name: 'Module',
  declarations: [
    { name: 'Controller', strategy: 'singleton', value: Ctrl }
  ],
  imports: [ servicesModule ]
});

app.listen(3000);
