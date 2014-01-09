/**
 * NotFoundError.
 *
 * 2013 (c) Andrey Popp <8mayday@gmail.com>
 */
"use strict";

/**
 * Error which will be thrown in case of no match found for a processed request.
 *
 * @param {String} url
 */
function NotFoundError(url) {
  Error.call(this, 'not found: ' + url);
  this.url = url;
}
NotFoundError.prototype = new Error();
NotFoundError.prototype.constructor = NotFoundError;
NotFoundError.prototype.name = 'NotFoundError';
NotFoundError.prototype.isNotFoundError = true;

module.exports = NotFoundError;
