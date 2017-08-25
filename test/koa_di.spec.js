'use strict';
const { expect } = require('chai');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body-parser');
const { createModule } = require('../src/module');
const DI = require('../src/di');
const koaDI = require('../src/frameworks/koa');

describe('KoaDI', () => {
  const http = require('http');

  class Ctrl {
    static get $inject() {
      return ['greet', 'from', 'App'];
    }

    constructor(greet, from, app) {
      this.greet = greet;
      this.from = from;
      this.app = app;
      this.name = 'Ctrl';
    }

    async getHandler(ctx, next, additionalParams) {
      ctx.body = `${this.greet} ${this.from} ${this.name} ${JSON.stringify(additionalParams)}`;
    }

    async echo(ctx) {
      ctx.body = ctx.request.body;
    }
  }

  const testModule = createModule({
    name: 'testModule',
    declarations: [
      { name: 'greet', strategy: 'constant',  value: 'Greet' },
      { name: 'from', strategy: 'constant', value: 'from' },
    ],
    exports: '*'
  });

  const moduleToBootstrap = {
    name: 'MainModule',
    declarations: [
      { name: 'ctrl', strategy: 'singleton', value: Ctrl }
    ],
    imports: [ testModule ],
    exports: ['ctrl']
  };

  describe('DI should work with framework', () => {
    it('call getHandler from `ctrl` dependency', done => {
      const app = new Koa();
      koaDI(moduleToBootstrap, app);

      app.use({
        controller: 'ctrl',
        action: 'getHandler',
        params: [1, 2, 3]
      });

      app.listen(3000);

      const req = http.get({
        port: 3000
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

    it('handle post http request with echo function', done => {
      const app = new Koa();
      koaDI(moduleToBootstrap, app);

      app.use(bodyParser());

      app.use({
        controller: 'ctrl',
        action: 'echo'
      });

      app.listen(3001);

      const req = http.request({
        port: 3001,
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        }
      }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => body += d.toString());
        res.on('end', () => {
          expect(body).to.equal('HEY!!!!! DOES ANYBODY HERE ME SCREAMING?!');
          done();
        });
      });
      req.on('error', err => {
        throw err;
      });
      req.write('HEY!!!!! DOES ANYBODY HERE ME SCREAMING?!');
      req.end();
    });

    it('get function as handler', done => {
      const app = new Koa();
      koaDI({
        name: 'MainModule',
        declarations: [
          { name: 'handler',
            strategy: 'value',
            value: async (ctx) => {
              ctx.body = 'handled';
            }
          }
        ],
        imports: [ testModule ],
        exports: ['handler']
      }, app);

      app.use('handler');

      app.listen(3003);

      const req = http.get({
        port: 3003
      }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => body += d.toString());
        res.on('end', () => {
          expect(body).to.equal('handled');
          done();
        });
      });
      req.on('error', err => {
        throw err;
      });
    });

    it('uses plain function without di', () => {
      const app = new Koa();

      app.use(async (ctx) => {
        ctx.body = 'handled';
      });

      app.listen(3002);

      const req = http.get({
        port: 3002
      }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => body += d.toString());
        res.on('end', () => {
          expect(body).to.equal('handled');
          done();
        });
      });
      req.on('error', err => {
        throw err;
      });
    });

    it('get DI from koa context', () => {
      const app = new Koa();
      koaDI(moduleToBootstrap, app);
      expect(app.context.di).to.be.instanceOf(DI)
    });

    it('has dependency "App" that is koa app', () => {
      const app = new Koa();
      koaDI(moduleToBootstrap, app);
      expect(app.context.di.resolve('App')).to.deep.equal(app);
    });
  });

  describe('use router', () => {
    const app = new Koa();
    const router = new Router();
    koaDI(moduleToBootstrap, app, router);

    app.use(bodyParser());

    router.post(['/', '/test'], {
      controller: 'ctrl',
      action: 'echo'
    }).get('/', {
      controller: 'ctrl',
      action: 'getHandler',
      params: [1, 2, 3]
    }).get('/test', async (ctx) => {
      ctx.body = 'handled';
    });

    app
      .use(router.routes())
      .use(router.allowedMethods());

    app.listen(3004);

    it('handle post http request with echo function', done => {
      const req = http.request({
        port: 3004,
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        }
      }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => body += d.toString());
        res.on('end', () => {
          expect(body).to.equal('HEY!!!!! DOES ANYBODY HERE ME SCREAMING?!');
          done();
        });
      });
      req.on('error', err => {
        throw err;
      });
      req.write('HEY!!!!! DOES ANYBODY HERE ME SCREAMING?!');
      req.end();
    });

    it('handle get request with di ctrl function', done => {
      const req = http.get({
        port: 3004,
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

    it('handle get request with plain fn', done => {
      const req = http.get({
        port: 3004,
        path: '/test'
      }, res => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', d => body += d.toString());
        res.on('end', () => {
          expect(body).to.equal('handled');
          done();
        });
      });
      req.on('error', err => {
        throw err;
      });
    });

  });
});