/**
 * Data-driven controller implementation.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var React                   = require('react');
var invariant               = require('react/lib/invariant');
var request                 = require('./request');
var utils                   = require('./utils');
var factory                 = require('./factory');
var BaseInterface           = require('./interface');
var BaseRenderingInterface  = require('./rendering-interface');

var Interface = utils.extend(BaseInterface, {

  /**
   * Override request process so it first fetches the data needed for a page
   * transition.
   */
  process: function(req, cb) {
    req = request.normalizeRequest(req);

    var page;
    try {
      page = this.createPageForRequest(req);
    } catch(err) {
      if (cb)
        return cb(err)
      else
        throw err;
    }

    var needData = typeof page.fetchData === 'function' && !this.state.request.data;

    if (request.isEqual(this.state.request, req) && !needData)
      return;

    fetchDataForRequest(this, page, req, function(err, req) {
      if (err) {
        if (cb)
          return cb(err)
        else
          throw err;
      }
      this.setState({request: req, page: page}, cb);
    }.bind(this));
  }
});

var RenderingInterface = utils.extend(BaseRenderingInterface, {

  renderToString: function(req, cb) {
    invariant(
      typeof cb === 'function',
      'provide callback as a last argument to renderToString(...)'
    );

    req = request.normalizeRequest(req);

    var controller, page;
    try {
      controller = this({request: request.normalizeRequest(req)});
      page = controller.createPageForRequest(req);
    } catch(err) {
      return cb(err);
    }

    fetchDataForRequest(controller, page, req, function(err, req) {
      if (err) return cb(err);

      try {
        React.renderComponentToString(controller, function(markup) {
          cb(null, {markup: markup, request: req, controller: controller});
        });
      } catch (e) {
        cb(e);
      }
    });
  }
});

function fetchDataForRequest(controller, page, req, cb) {
  if (!page || req.data || typeof page.fetchData !== 'function') {
    cb(null, req, page);
  } else {
    page.fetchData(req, function(err, data) {
      if (err) return cb(err);
      req.data = JSON.parse(JSON.stringify(data));
      cb(null, req, page);
    });
  }
}

var createController = factory.bind(null, Interface, RenderingInterface);

module.exports = createController;
module.exports.createController = createController;

