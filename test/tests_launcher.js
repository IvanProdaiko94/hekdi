/**
 * Created by Ivan Prodaiko on 10/24/17.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');

const nodeVersion = process.versions.node.split('.').map(Number);

// Instantiate a Mocha instance.
const mocha = new Mocha();
const testDir = 'test';

fs.readdirSync(testDir).filter(file => {
  if (nodeVersion[0] <= 6 && file.indexOf('koa') !== -1) {
    return false;
  }
  return file.substr(-8) === '.spec.js';

}).forEach(file => {
  mocha.addFile(path.join(testDir, file));
});

mocha.run(failures => {
  process.exitCode = failures ? -1 : 0;
  process.exit(); // exit with non-zero status if there were failures
});
