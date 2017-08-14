'use strict';

const express = require('express');
const { DI } = require('..');

const di = DI.create();
const app = express();

class Ctrl {
  static get $inject() {
    return ['hello', 'world'];
  }
  constructor(s1, s2) {
    this.s1 = s1;
    this.s2 = s2;
  }

  greet(req, res) {
    res.send(`${this.s1},${this.s2}`);
  }
}


const servicesModule = di.module({
  name: 'ServicesModule',
  declarations: [
    { name: 'hello', strategy: 'value', value: 'Hello' },
    { name: 'world', strategy: 'value', value: 'World' },
  ],
  exports: '*'
});

di.bootstrap({
  name: 'Module',
  declarations: [
    { name: 'Controller', strategy: 'singleton', value: Ctrl }
  ],
  imports: [ servicesModule ]
});

const pathToCtrl = {
  '/': {
    ctrl: 'Controller',
    method: 'greet'
  }
};

app.get('/', (req, res) => {
  const config = pathToCtrl[req.path];
  di.resolve(config.ctrl)[config.method](req, res);
});

app.listen(3000);
