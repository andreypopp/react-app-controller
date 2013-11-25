"use strict";

/**
 * If object is a string
 *
 * @param {Object} obj
 */
function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function assign(dst, src) {
  for (var k in src)
    dst[k] = src[k];
  return dst;
}

function extend(a, b) {
  var result = {};

  assign(result, a);
  assign(result, b);

  return result;
}

module.exports = {
  isString: isString,
  extend: extend,
  assign: assign
};
