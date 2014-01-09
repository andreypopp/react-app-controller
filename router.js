/**
 * URL router
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var toPattern = require('url-pattern');

function Router(routes) {
  this.registered = [];

  if (routes) {
    for (var k in routes) {
      this.addRoute(k, routes[k]);
    }
  }
}

Router.prototype = {

  /**
   * Register a handler for a specified route
   *
   * @param {String} pattern
   * @param {Object} handler
   */
  addRoute: function(pattern, handler) {
    this.registered.push({
      pattern: toPattern(pattern),
      handler: handler
    });
    return this;
  },

  /**
   * Match registered routes against path.
   *
   * @param {String} path
   * @return {Object|undefined}
   */
  match: function(path) {
    for (var i = 0, length = this.registered.length; i < length; i++) {
      var params = this.registered[i].pattern.match(path);
      if (params !== null) {
        return {handler: this.registered[i].handler, params: params};
      }
    }
  }
};

module.exports = function(routes) {
  return new Router(routes);
}
