var assert = require('assert');
var React = require('react-tools/build/modules/React');
var createController = require('../index');

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
      '/': MainPage,
      '/about': AboutPage
    });
  });

  it('renders markup of matched component', function(done) {
    controller.generateMarkup('/about', function(err, markup) {
      assert.ok(!err, err);
      assert.ok(/AboutPage/.exec(markup.markup));
      done();
    });
  });

  it('returns NotFoundError if no match found for a request', function(done) {
    controller.generateMarkup('/someurl', function(err, markup) {
      assert.ok(err);
      assert.ok(err instanceof createController.NotFoundError);
      done();
    });
  });
});
