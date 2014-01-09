/**
 * Rendering interface for application controllers.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var React                 = require('react');
var invariant             = require('react/lib/invariant');
var request               = require('./request');

module.exports = {

  /**
   * Render controller component into DOM element for specified request.
   *
   * If not request is specified than it will be constructed from
   * window.location.
   *
   * If no callback is specified and error is occurred then it will be thrown.
   *
   * @param {DOMElement} element
   * @param {Request?} req
   * @paran {Callback?}
   */
  render: function(element, req, cb) {
    var controller;

    if (typeof req === 'function') {
      cb = req;
      req = null;
    }

    try {
      controller = this({request: request.normalizeRequest(req)});
      controller = React.renderComponent(controller, element);
    } catch(err) {
      if (cb)
        return cb(err)
      else
        throw err;
    }

    cb && cb(null, controller);
  },

  /**
   * Render controller for specified request into markup string
   *
   * @param {Request} req
   * @param {Callback} cb callback receives object {markup: ..., request: ...}
   */
  renderToString: function(req, cb) {
    invariant(
      typeof cb === 'function',
      'provide callback as a last argument to renderToString(...)'
    );

    var controller = this({request: request.normalizeRequest(req)});
    try {
      React.renderComponentToString(controller, function(markup) {
        cb(null, {markup: markup, request: req, controller: controller});
      });
    } catch (err) {
      cb(err);
    }
  }
};
