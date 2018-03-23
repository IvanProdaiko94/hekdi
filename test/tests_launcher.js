/**
 * Created by Ivan Prodaiko on 10/24/17.
 */

'use strict';

const { spawn } = require('child_process');

const nodeVersion = process.versions.node.split('.').map(Number);

const files = nodeVersion[0] > 6 ? './test/**/*.spec.js' : './test/*.spec.js';

const child = spawn('mocha', [files]);

child.stdout.on('data', (data) => console.log(data.toString()));

child.stderr.on('data', (data) => console.error(data.toString()));

child.on('exit', exitCode => process.exit(exitCode));
