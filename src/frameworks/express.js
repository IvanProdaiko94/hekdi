/**
 * Created by Ivan Prodaiko on 14-Aug-17.
 */

'use strict';

const DI = require('../di');

/**
 *
 * @param app
 * @param config Object
 * @constructor
 */
function ExpressDI(app, config) {
  DI.call(this);

  for (const key in config) {
    for (const method in config[key]) {
      const routeConfig = config[key][method];
      if (routeConfig.middlewares && routeConfig.middlewares.length) {
        const fns = routeConfig.middlewares.map(
          middleware => (middleware === 'function' ?
          middleware :
          (...args) => this.resolve(middleware.controller)[middleware.fn](...args))
      );
        app.use(key, ...fns);
      }
      if (!routeConfig.data) {
        routeConfig.data = [];
      }
      app[method](
        key,
        (...args) => this.resolve(routeConfig.controller)[routeConfig.fn](...args, ...routeConfig.data)
    );
    }
  }
}

ExpressDI.prototype = DI.prototype;
DI.prototype.constructor = DI;

ExpressDI.create = function(app, config) {
  return new ExpressDI(app, config);
};

module.exports = ExpressDI;
