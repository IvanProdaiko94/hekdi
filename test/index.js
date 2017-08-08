/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const app = require('../src/app');

app.bootstrap({
  name: 'AppModule',
  declarations: [
    { name: 'Alias', strategy: 'alias', value: 'dependency' }
  ],
  imports: [
    require('./modules/another.module')
  ]
});

//const dependency = app.resolve('Alias');
app.main.injector.dependencies.forEach((val, key) => console.log(val, key));
