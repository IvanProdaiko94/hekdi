/**
 * Created by Ivan Prodaiko on 07-Aug-17.
 */

'use strict';
const { createModule } = require('../../src/module');

class X {
  constructor() {
    console.log('isTest=', true);
  }
}

module.exports = createModule({
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
