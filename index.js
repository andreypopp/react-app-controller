/**
 * React application controller.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var React                 = require('react-tools/build/modules/React');
var invariant             = require('react-tools/build/modules/invariant');
var createRouter          = require('./router');
var NotFoundError         = require('./not-found-error');
var utils                 = require('./utils');
var request               = require('./request');

var ControllerInterface = {

  getInitialState: function() {
    return {request: null};
  },

  componentDidMount: function() {
    window.addEventListener('popstate', this.onPopState);
  },

  componentWillUnmount: function() {
    window.removeEventListener('popstate', this.onPopState);
  },

  getCurrentRequest: function() {
    return this.state.request || this.props.request;
  },

  renderPage: function() {
    var req = this.getCurrentRequest();
    var match = this.router.match(req.path);

    if (!match) {
      throw new NotFoundError(req.path);
    }

    return match.handler({req: req});
  },

  /**
   * Handle 'popstate' event
   *
   * @private
   */
  onPopState: function(e) {
    e.preventDefault();
    this.setState({request: request.normalizeRequest(req)});
  },

  /**
   * Navigate to a new URL
   *
   * @param {String|Request} URL
   * @param {Callback} cb
   */
  navigate: function(req, cb) {
    var url = request.createURLFromRequest(req);
    window.history.pushState(null, '', url);
    this.setState({request: request.normalizeRequest(req)}, cb);
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
      return cb(err);
    }

    cb(null, component);
  },

  renderToString: function(req, cb) {
    var component = this({request: request.normalizeRequest(req)});
    try {
      React.renderComponentToString(component, function(markup) {
        cb(null, {markup: markup});
      });
    } catch (err) {
      cb(err);
    }
  }
};

function defaultRender() {
  return React.DOM.div(null, this.renderPage());
}

/**
 * Create controller
 *
 * @param {Object} routes Mapping from URL patterns to React components
 */
function createController(spec, iface, renderingIface) {
  iface = iface || ControllerInterface;
  renderingIface = renderingIface || ControllerRenderingInterface;

  if (!spec.router && spec.routes)
    spec.router = createRouter(spec.routes);

  if (!spec.render)
    spec.render = defaultRender;

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
