/**
 * Created by Ivan Prodaiko on 10/21/17.
 */

'use strict';

const { circularDependency } = require('./errors');

const resolutionChecker = function(set = null, name) {
  const toInject = this.getConfigOf(name).value.$inject;
  if (set && set.has(name)) {
    throw new Error(circularDependency(Array.from(set).join(' -> '), name));
  }
  set = set || new Set([name]);
  set.add(name);
  if (toInject && toInject.length) {
    toInject.forEach(name => {
      resolutionChecker.call(this, set, name);
    });
  }
  return set;
};

module.exports = resolutionChecker;
