"use strict";

var React         = require('react-tools/build/modules/React');
var invariant     = require('react-tools/build/modules/invariant');
var NotFoundError = require('./not-found-error');
var utils         = require('./utils');
var Base          = require('./index');

var ControllerInterface = utils.extend(Base.ControllerInterface, {
  /**
   * Create a page for a specified request
   *
   * @param {Request} req
   * @private
   */
  createPageForRequest: function(req) {
    var match = this.router.match(req.path);

    if (!match) {
      throw new NotFoundError(req.path);
    }

    var props = utils.extend({request: req}, match.params);
    return new match.handler(this, props);
  },

  defaultRender: function() {
    return this.state.page.render();
  }
});

function Page(controller, props) {
  this.controller = controller;
  this.state = controller.state;
  this.props = utils.assign(Object.create(controller.props), props);
}

Page.prototype = {
  // TODO: pageDidMount, pageWillUnmount and figure out where to call them from
  // the controller

  getDOMNode: function() {
    return this.controller.getDOMNode();
  },

  isMounted: function() {
    return this.controller.isMounted();
  }
};

function createPage(spec) {
  invariant(
    typeof spec.render === 'function',
    'createPage(spec): `render` function should be provided'
  );

  function PageConstructor(controller, props) {
    Page.call(this, controller, props);
  }
  PageConstructor.prototype = utils.assign(Object.create(Page.prototype), spec);

  return PageConstructor;
}

function createController(spec) {
  return Base.createController(spec, ControllerInterface, Base.ControllerRenderingInterface);
}

module.exports = createController;
module.exports.createController = createController;
module.exports.createPage = createPage;
