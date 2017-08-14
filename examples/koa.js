'use strict';

const Koa = require('koa');
const { DI } = require('..');

const app = new Koa();
DI.integrateWith(app);

const diMiddleware = async (ctx, next) => {
  ctx.path()
};

app.use(diMiddleware);

app.use(async ctx => {

});

app.listen(3000);