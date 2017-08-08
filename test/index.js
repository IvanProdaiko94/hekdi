/**
 * Created by Ivan Prodaiko on 06-Aug-17.
 */
'use strict';

const createApp = require('../src/app');
const app = createApp();

// {
//     name: 'AppModule',
//         declarations: [
//     { name: 'Alias', strategy: 'alias', value: 'dependency' }
// ],
//     imports: [
//     require('./modules/shared.module'),
//     require('./modules/another.module'),
// ]
// }

app.bootstrap(require('./modules/another.module'));

const dependency = app.resolve('dependency');
console.log(dependency.toString());
