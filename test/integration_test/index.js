/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const DI = require('../../src/di');

const di = new DI();

di.bootstrap({
  name: 'AppModule',
  declarations: [
    { name: 'Alias', strategy: 'alias', value: 'dependency' }
  ],
  imports: [
    require('./modules/another.module')
  ]
});

//const dependency = app.resolve('Alias');
di.main.injector.dependencies.forEach((val, key) => console.log(val, key));
