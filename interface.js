/**
 * Interface for application controllers.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var React                 = require('react');
var NotFoundError         = require('./not-found-error');
var utils                 = require('./utils');
var request               = require('./request');

module.exports = {

  getInitialState: function() {
    var req = this.props.request;
    var page = this.createPageForRequest(req);
    return {
      request: req,
      page: page
    };
  },

  /**
   * Default render implementation.
   *
   * Will be mixed in by createController function to workaround
   * ReactCompositeComponent policy which disallows render() method overrides.
   */
  defaultRender: function() {
    if (this.state.page !== null) {
      return React.DOM.div(null, this.state.page);
    } else if (typeof this.renderNotFound === 'function') {
      return this.renderNotFound();
    } else {
      throw new NotFoundError(this.state.request.path);
    }
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
      return null;
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

    var page = this.createPageForRequest(req);

    this.setState({
      request: req,
      page: page
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
