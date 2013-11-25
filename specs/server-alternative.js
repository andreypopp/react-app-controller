var assert = require('assert');
var React = require('react-tools/build/modules/React');
var ReactApp = require('../alternative');
var NotFoundError = require('../not-found-error');

var MainPage = ReactApp.createPage({
  render: function() {
    return React.DOM.div(null, 'MainPage');
  }
});

var AboutPage = ReactApp.createPage({
  render: function() {
    return React.DOM.div(null, 'AboutPage');
  }
});

describe('react-app-controller on server', function() {

  var controller;

  beforeEach(function() {
    controller = ReactApp.createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });
  });

  it('renders markup of matched component', function(done) {
    controller.renderToString('/about', function(err, markup) {
      assert.ok(!err, err);
      assert.ok(/AboutPage/.exec(markup.markup));
      done();
    });
  });

  it('returns NotFoundError if no match found for a request', function(done) {
    controller.renderToString('/someurl', function(err, markup) {
      assert.ok(err);
      assert.ok(err instanceof NotFoundError);
      done();
    });
  });
});
