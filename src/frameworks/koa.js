/**
 * Created by Ivan Prodaiko on 14-Aug-17.
 */

'use strict';

const DI = require('../di');

/**
 *
 * @param app
 * @param bootstrapModule {Module|Object}
 * @param [router]
 */
module.exports = function koaDi(app, bootstrapModule, router) {
  app.context.di = new DI();
  app.context.di.bootstrap(bootstrapModule);
  const use = app.use;
  /**
   * @param ctx {Object}
   * @param original {Function}
   * @returns {Function}
   */
  const diResolver = function(ctx, original) {
    /** @param ctx {Function|String|Object<{controller: string, action: string, [params]: Array}>} */
    return function(diConfig) {
      switch (typeof diConfig) {
        case 'string':
          original.call(ctx, app.context.di.resolve(diConfig));
          break;
        case 'object': // array
          const { controller, action, params } = diConfig;
          const dependency = app.context.di.resolve(controller);
          original.call(ctx, async (ctx, next) => {
            if (next) {
              await dependency[action](ctx, next, params);
            } else {
              await dependency[action](ctx, params);
            }
          });
          break;
        default: // function
          original.call(ctx, diConfig);
      }
    };
  };

  app.use = diResolver(app, use);
};
