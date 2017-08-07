/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const createApp = require('../src/app');
const app = createApp();

app.bootstrap({
  name: 'AppModule',
  declarations: [
    { name: 'Alias', strategy: 'alias', value: 'dependency' }
  ],
  imports: [
    require('./modules/shared.module'),
    require('./modules/another.module'),
  ]
});

const alias = app.resolve('Alias');
console.log(alias);