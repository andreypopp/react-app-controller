"use strict";

var React                 = require('react');
var invariant             = require('react/lib/invariant');
var createRouter          = require('./router');

/**
 * Create controller
 *
 * @param {Object} spec React component specification extended with `routes`
 *                      declarations
 */
function factory(iface, renderingIface, spec) {
  spec = spec || {};

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

module.exports = factory;
