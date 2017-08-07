/**
 * Created by Ivan Prodaiko on 07-Aug-17.
 */

'use strict';
const { createModule } = require('../../src/module');
const sharedModule = require('./shared.module');

class Dependency {
  static get $inject() {
    return ['Singleton', 'Factory', 'Value', 'Constant'];
  }

  constructor(singleton, factory, value, constant) {
    console.log(singleton, factory, value, constant);
  }
}

module.exports = createModule({
  name: 'AnotherModule',
  declarations: [
    { name: 'dependency', strategy: 'constant',  value: Dependency }
  ],
  imports: [ sharedModule ],
  exports: '*'
});