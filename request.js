/**
 * Request related functions.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

var qs    = require('querystring');
var utils = require('./utils');

function createURLFromRequest(request) {
  var url = request.path;
  if (request.query)
    url = url + '?' + qs.stringify(request.query);
  return url;
}

/**
 * Create request from URL
 *
 * @param {String} url
 */
function createRequestFromURL(url) {
  if (url.indexOf('?') > -1) {
    var parts = url.split('?');
    return {
      path: parts[0],
      query: qs.parse(parts[1])
    };
  } else {
    return {
      path: url,
      query: undefined
    };
  }
}

/**
 * Create request from location (such as window.location)
 *
 * @param {Location} loc
 */
function createRequestFromLocation(loc) {
  return {
    path: loc.pathname,
    query: loc.search ? qs.parse(loc.search.slice(1)) : null
  };
}

function normalizeRequest(req) {
  if (utils.isString(req)) {
    req = createRequestFromURL(req);
  } else if (!req) {
    req = createRequestFromLocation(window.location);
  } else if (req && !req.path) {
    var data = req;
    req = createRequestFromLocation(window.location);
    for (var k in data)
      if (k !== 'path' && k !== 'query')
        req[k] = data[k];
  }
  return req;
}

function isEqual(a, b) {
  if (a.path !== b.path)
    return false;

  if (a.query !== b.query)
    return false;

  var k;

  for (k in a.query)
    if (a.query[k] !== b.query[k])
      return false;

  for (k in b.query)
    if (a.query[k] !== b.query[k])
      return false;

  return true;
}

module.exports = {
  isEqual: isEqual,
  normalizeRequest: normalizeRequest,
  createRequestFromURL: createRequestFromURL,
  createRequestFromLocation: createRequestFromLocation,
  createURLFromRequest: createURLFromRequest
};
