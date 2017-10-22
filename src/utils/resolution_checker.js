/**
 * Created by Ivan Prodaiko on 10/21/17.
 */

'use strict';

const { circularDependency } = require('./errors');

const resolutionChecker = function(arr = null, name, index = 0) {
  const toInject = this.getConfigOf(name).value.$inject;
  if (arr && arr.indexOf(name) !== -1) {
    arr.push(name);
    throw new Error(circularDependency(name, arr.join(' -> ')));
  }
  arr = arr || [];
  index ? arr.splice(index, 1, name) : arr.push(name);
  if (toInject && toInject.length) {
    toInject.forEach(name => {
      resolutionChecker.call(this, arr, name, index + 1);
    });
  }
  return arr;
};

module.exports = resolutionChecker;
