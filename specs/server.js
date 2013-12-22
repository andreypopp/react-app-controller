var assert = require('assert');
var React = require('react');
var createController = require('../index');
var NotFoundError = require('../not-found-error');

var MainPage = React.createClass({
  render: function() {
    return React.DOM.div(null, 'MainPage');
  }
});

var AboutPage = React.createClass({
  render: function() {
    return React.DOM.div(null, 'AboutPage');
  }
});

describe('react-app-controller on server', function() {

  var controller;

  beforeEach(function() {
    controller = createController({
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

  it('allows rendering custom UI on NotFoundError', function(done) {
    controller = createController({
      routes: {},
      renderNotFound: function() {
        return React.DOM.div(null, '404');
      }
    });

    controller.renderToString('/about', function(err, markup) {
      assert.ok(!err, err);
      assert.ok(/404/.exec(markup.markup));
      done();
    });
  });
});
