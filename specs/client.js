require('es5-shim');

var assert            = require('assert');
var React             = require('react-tools/build/modules/React');
var createController  = require('../index');
var NotFoundError     = require('../not-found-error');

var MainPage = React.createClass({
  render: function() {
    return React.DOM.div({className: 'MainPage'}, 'MainPage');
  }
});

var AboutPage = React.createClass({
  render: function() {
    return React.DOM.div({className: 'AboutPage'}, 'AboutPage');
  }
});

describe('react-app-controller on client', function() {

  var controller;
  var root = document.getElementById('root');

  beforeEach(function() {
    controller = createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });
  });

  afterEach(function() {
    controller = undefined;
    React.unmountComponentAtNode(controller);
  });

  it('renders /', function(done) {
    controller.render(root, '/', function(err, controller) {
      assert.ok(!err);
      assert.ok(document.querySelector('.MainPage'));
      assert.ok(!document.querySelector('.AboutPage'));

      assert.ok(controller.state.page);
      assert.ok(controller.state.request);
      assert.equal(controller.state.request.path, '/');

      done();
    });
  });

  it('renders /about', function(done) {
    controller.render(root, '/about', function(err, controller) {
      assert.ok(!err);
      assert.ok(!document.querySelector('.MainPage'));
      assert.ok(document.querySelector('.AboutPage'));

      assert.ok(controller.state.page);
      assert.ok(controller.state.request);
      assert.equal(controller.state.request.path, '/about');

      done();
    });
  });

  it('navigates from one page to another', function(done) {
    controller.render(root, '/', function(err, controller) {
      assert.ok(!err);
      assert.ok(document.querySelector('.MainPage'));
      assert.ok(!document.querySelector('.AboutPage'));
      assert.ok(controller.state.page);
      assert.ok(controller.state.request);
      assert.equal(controller.state.request.path, '/');

      controller.navigate('/about', function() {
        assert.ok(!document.querySelector('.MainPage'));
        assert.ok(document.querySelector('.AboutPage'));
        assert.ok(controller.state.page);
        assert.ok(controller.state.request);
        assert.equal(controller.state.request.path, '/about');
        done();
      });
    });
  });

  it('throws NotFoundError if no match found for a request', function(done) {
    controller.render(root, '/not-found', function(err, controller) {
      assert.ok(err);
      assert.ok(err instanceof NotFoundError);
      done();
    });
  });

});
