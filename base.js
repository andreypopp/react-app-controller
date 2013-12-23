/**
 * Base controller implementation.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var factory               = require('./factory');
var Interface             = require('./interface');
var RenderingInterface    = require('./rendering-interface');

var createController = factory.bind(null, Interface, RenderingInterface);

module.exports = createController;
module.exports.createController = createController;
