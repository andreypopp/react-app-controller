var assert = require('assert');
var createController = require('../index');
var createRouter = require('../router');

describe('react-app-controller', function() {

  it('requires `routes` declaration', function() {
    assert.throws(function() {
      createController({});
    }, /Invariant Violation/);
  });

  it('allows creating controller with routes', function() {
    createController({routes: {}});
  });

  it('allows creating controller with router', function() {
    createController({router: createRouter({})});
  });

});
