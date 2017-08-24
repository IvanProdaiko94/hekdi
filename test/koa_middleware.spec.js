'use strict';
const { expect } = require('chai');
const Koa = require('koa');
const { createModule } = require('../src/module');
const koaDI = require('../src/frameworks/koa');

describe('KoaDI', () => {
  const http = require('http');

  class Ctrl {
    static get $inject() {
      return ['greet', 'from'];
    }

    constructor(greet, from) {
      this.greet = greet;
      this.from = from;
      this.name = 'Ctrl';
    }

    async getHandler(ctx, next, additionalParams) {
      ctx.body = `${this.greet} ${this.from} ${this.name} ${JSON.stringify(additionalParams)}`;
    }

    async postHandler(ctx) {
      ctx.body = ctx.request.body; //echo
    }
  }

  const testModuleConfig = createModule({
    name: 'testModule',
    declarations: [
      { name: 'greet', strategy: 'constant',  value: 'Greet' },
      { name: 'from', strategy: 'constant', value: 'from' },
    ],
    exports: '*'
  });

  describe('respond correctly', () => {
    it('should call getHandler from `ctrl` dependency', done => {
      const app = new Koa();
      koaDI(app, {
        name: 'MainModule',
        declarations: [
          { name: 'ctrl', strategy: 'singleton', value: Ctrl }
        ],
        imports: [ testModuleConfig ],
        exports: ['ctrl']
      });

      app.use(['ctrl', 'getHandler', [1, 2, 3]]);

      app.listen(3000);

      const req = http.get({
        port: 3000,
        path: '/'
      }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => body += d.toString());
        res.on('end', () => {
          expect(body).to.equal('Greet from Ctrl [1,2,3]');
          done();
        });
      });
      req.on('error', err => {
        throw err;
      });
    });
  });
});