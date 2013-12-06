/**
 * React application controller.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var React                 = require('react');
var invariant             = require('react/lib/invariant');
var createRouter          = require('./router');
var NotFoundError         = require('./not-found-error');
var utils                 = require('./utils');
var request               = require('./request');

var ControllerInterface = {

  getInitialState: function() {
    var req = this.props.request;
    return {
      request: req,
      page: this.createPageForRequest(req)
    };
  },

  /**
   * Default render implementation.
   *
   * Will be mixed in by createController function to workaround
   * ReactCompositeComponent policy which disallows render() method overrides.
   */
  defaultRender: function() {
    return React.DOM.div(null, this.state.page);
  },

  componentDidMount: function() {
    window.addEventListener('popstate', this.onPopState);
  },

  componentWillUnmount: function() {
    window.removeEventListener('popstate', this.onPopState);
  },

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

    return match.handler(utils.extend({request: req}, match.params));
  },

  /**
   * Process request
   *
   * @param {Request} req
   * @param {Callback?} cb
   *
   * @private
   */
  process: function(req, cb) {
    req = request.normalizeRequest(req);

    if (request.isEqual(this.state.request, req))
      return;

    this.setState({
      request: req,
      page: this.createPageForRequest(req)
    }, cb);
  },

  /**
   * Handle 'popstate' event
   *
   * @private
   */
  onPopState: function(e) {
    e.preventDefault();
    this.process();
  },

  /**
   * Navigate to a new URL
   *
   * @param {String|Request} URL
   * @param {Callback} cb
   */
  navigate: function(req, cb) {
    req = request.normalizeRequest(req);
    var url = request.createURLFromRequest(req);
    window.history.pushState(null, '', url);
    this.process(req, cb);
  },

  /**
   * Navigate to a new URL by updating querystring
   *
   * @param {Object} query Values for querystring
   * @param {Callback} cb
   */
  navigateQuery: function(query, cb) {
    var k, newQuery = {}
    for (k in this.activeRequest.query)
      newQuery[k] = this.activeRequest.query[k];
    for (k in query)
      newQuery[k] = query[k];
    var req= {path: this.activeRequest.path, query: newQuery};
    this.navigate(req, cb);
  }
};

var ControllerRenderingInterface = {

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
    var component;

    if (typeof req === 'function') {
      cb = req;
      req = null;
    }

    try {
      component = this({request: request.normalizeRequest(req)});
      component = React.renderComponent(component, element);
    } catch(err) {
      if (cb)
        return cb(err)
      else
        throw err;
    }

    cb && cb(null, component);
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

    var component = this({request: request.normalizeRequest(req)});
    try {
      React.renderComponentToString(component, function(markup) {
        cb(null, {markup: markup, request: req});
      });
    } catch (err) {
      cb(err);
    }
  }
};

/**
 * Create controller
 *
 * @param {Object} spec React component specification extended with `routes`
 *                      declarations
 */
function createController(spec, iface, renderingIface) {
  spec = spec || {};
  iface = iface || ControllerInterface;
  renderingIface = renderingIface || ControllerRenderingInterface;

  invariant(
    spec.routes || spec.router,
    'missing `routes` declaration for a react-app controller'
  );

  if (!spec.router && spec.routes)
    spec.router = createRouter(spec.routes);

  if (!spec.render)
    spec.render = iface.defaultRender;

  spec.mixins = spec.mixins || [];
  spec.mixins.unshift(iface);

  var cls = React.createClass(spec);

  for (var k in renderingIface)
    cls[k] = renderingIface[k];

  return cls;
}

module.exports = createController;
module.exports.createController = createController;
module.exports.ControllerInterface = ControllerInterface;
module.exports.ControllerRenderingInterface = ControllerRenderingInterface;
