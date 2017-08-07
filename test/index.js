/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const createApp = require('../src/app');
const app = createApp();

class X {
  constructor() {
    this.isTest = true;
  }
}

class Dependency {
  static get $inject() {
    return ['Singleton', 'Factory', 'Value', 'Constant'];
  }

  constructor(singleton, factory, value, constant) {
    console.log(singleton, factory, value, constant);
  }
}

const sharedModule = app.module({
  name: 'SharedModule',
  declarations: [
    { name: 'Singleton', strategy: 'singleton', value: X },
    { name: 'Factory',   strategy: 'factory',   value: X },
    { name: 'Value',     strategy: 'value',     value: X },
    { name: 'Constant',  strategy: 'constant',  value: X }
  ],
  exports: [
    'Singleton',
    'Factory',
    'Value'
  ]
});

const anotherModule = app.module({
  name: 'AnotherModule',
  declarations: [
    { name: 'dependency', strategy: 'constant',  value: Dependency }
  ],
  imports: [ sharedModule ],
  exports: '*'
});

app.bootstrap({
  name: 'AppModule',
  declarations: [
    { name: 'Alias', strategy: 'alias', value: 'dependency' }
  ],
  imports: [
    sharedModule,
    anotherModule
  ]
});
