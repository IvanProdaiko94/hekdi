'use strict';

const Koa = require('koa');
const Router = require('koa-router');
const { DI } = require('..');

const app = new Koa();
const router = new Router();
DI.integrateWith(app);

class Ctrl {
  static get $inject() {
    return ['hello', 'world'];
  }
  constructor(s1, s2) {
    this.s1 = s1;
    this.s2 = s2;
  }

  async greet(ctx) {
    const timeout = ms => {
      return new Promise(resolve => setTimeout(() => resolve(`${this.s1},${this.s2}`), ms));
    };
    ctx.body = await timeout(3000);
  }
}


const servicesModule = app.module({
  name: 'ServicesModule',
  declarations: [
    { name: 'hello', strategy: 'value', value: 'Hello' },
    { name: 'world', strategy: 'value', value: 'World' },
  ],
  exports: '*'
});

app.bootstrap({
  name: 'Module',
  declarations: [
    { name: 'Controller', strategy: 'singleton', value: Ctrl }
  ],
  imports: [ servicesModule ]
});

const pathToCtrl = {
  '/': {
    ctrl: 'Controller',
    method: 'greet'
  }
};

router.get('/', async ctx => {
  const config = pathToCtrl[ctx._matchedRoute];
  ctx.app.resolve(config.ctrl)[config.method](ctx);
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3001);