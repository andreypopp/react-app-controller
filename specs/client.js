require('es5-shim');

var assert            = require('assert'),
    createController  = require('../index'),
    React             = require('react-tools/build/modules/React');

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

describe('react-app-controller on client', function() {

  var controller;

  beforeEach(function() {
    controller = createController({
      '/': MainPage,
      '/about': AboutPage
    }, {mountPoint: document.getElementById('root')});
  });

  afterEach(function() {
    controller.stop();
    controller = undefined;
  });

  it('throws NotFoundError if no match found for a request', function(done) {

    controller.start(null, function(err, controller) {
      assert.ok(err);
      assert.ok(err instanceof createController.NotFoundError);
      done();
    });
  });

});
