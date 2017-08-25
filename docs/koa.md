# Koa.js usage:

`hekdi` can be integrated with [koa.js](https://github.com/koajs/koa).

The main concept of framework integration is monkey patching of functions
that are responsible for requests handling.

While using koa hakdi monkey patches `use` method.

#### Basic usage:
```javascript
const Koa = require('koa');
const koaDI = require('hakdi');
const app = new Koa();

const moduleToBootstrap = {
  name: 'MainModule',
  declarations: [
    { name: 'ctrl', strategy: 'singleton', value: SomeClass },
    { name: 'echo', 
      strategy: 'value', 
      value: async (ctx) => {
         ctx.body = ctx.request.body;
      }
    }
  ],
  exports: '*'
};

koaDI(moduleToBootstrap, app);
// now di is already bootstrapped and ready to work. 
// In koa app you can reach di as `app.context.di`
// In di you can get koa app as `App` dependency.
app.use({
  controller: 'ctrl', // if dependency is object
  action: 'middleware', // you tell which of its methods will be called
  params: [1, 2, 3] // also you can pass additional params to call if needed
});

app.use('echo'); 
// you can reach some function without class creation by passing as string
// to `use` method

app.use(async (ctx) => { // you still can pass function to `use` method
  ctx.body = ctx.request.body;
});
```

### Usage with router
While using router the story is almost the same:
```javascript
'use strict';

const Koa = require('koa');
const koaDI = require('hakdi');
const bodyParser = require('koa-body-parser');

const app = new Koa();
const router = new Router();

const moduleToBootstrap = {
  name: 'MainModule',
  declarations: [
    { name: 'ctrl', strategy: 'singleton', value: SomeClass },
    { name: 'echo', 
      strategy: 'value', 
      value: async (ctx) => {
         ctx.body = ctx.request.body;
      }
    }
  ],
  exports: '*'
};

koaDI(moduleToBootstrap, app, router);

app.use(bodyParser());

router
  .post(['/', '/test'], 'echo')
  .get('/', {
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
```
