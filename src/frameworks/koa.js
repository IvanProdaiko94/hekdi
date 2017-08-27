/**
 * Created by Ivan Prodaiko on 14-Aug-17.
 */

'use strict';

const DI = require('../di');

/**
 * @param app {Koa.application}
 * @param original {Function}
 * @returns {Function}
 */
const diResolver = function(app, original) {
  /** @param diConfig {Function|String|Object<{[controller]: string, action: string, [params]: Array}>} */
  return function(diConfig) {
    if (typeof diConfig === 'object') {
      const { controller, action, params } = diConfig;
      if (!controller && !action) {
        throw new Error('Incorrect dependency config provided!');
      }
      original.call(app, async (ctx, next) => {
        let dependency;
        if (!controller && action) {
          dependency = app.context.di.resolve(action);
          await dependency(ctx, next, params);
        } else {
          dependency = app.context.di.resolve(controller);
          await dependency[action](ctx, next, params);
        }
      });
    } else {
      original.call(app, diConfig);
    }
    return app;
  };
};

/**
 * @param app {Object}
 * @param router {Router}
 * @param original {Function}
 * @returns {Function}
 */
const diRouterResolver = function(app, router, original) {
  /**
   * path {string}
   * @param diConfig {Function|String|Object<{controller: string, action: string, [params]: Array}>}
   */
  return function(...args) {
    const [name, path] = args;
    const isRouteNamed = typeof name === 'string' && (typeof path === 'string' || path instanceof RegExp);
    const middlewares = args.slice(isRouteNamed ? 2 : 1).map(config => {
      if (typeof config === 'object') {
        const { controller, action, params } = config;
        if (!controller && !action) {
          throw new Error('Incorrect dependency config provided!');
        }
        return async (ctx, next) => {
          let dependency;
          if (!controller && action) {
            dependency = app.context.di.resolve(action);
            await dependency(ctx, next, params);
          } else {
            dependency = app.context.di.resolve(controller);
            await dependency[action](ctx, next, params);
          }
        }
      }
      return config;
    });

    if (isRouteNamed) {
      original.call(router, name, path, ...middlewares);
    } else {
      original.call(router, name, ...middlewares);
    }
    return router;
  };
};

/**
 *
 * @param app
 * @param bootstrapModule {Module|Object}
 * @param [router]
 */
module.exports = function koaDi(bootstrapModule, app, router) {
  const di = new DI();
  di.bootstrap(bootstrapModule);
  di.main.injector.register({name: 'App', strategy: 'constant', value: app});
  app.context.di = di;

  app.use = diResolver(app, app.use);

  if (router) {
    router.use = diRouterResolver(app, router, router.use);
    router.methods.forEach(method => {
      const methodName = method.toLowerCase();
      router[methodName] = diRouterResolver(app, router, router[methodName]);
    })
  }
};
