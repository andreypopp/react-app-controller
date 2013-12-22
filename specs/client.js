require('es5-shim');

var assert            = require('assert');
var React             = require('react');
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

  afterEach(function() {
    if (controller !== undefined) {
      React.unmountComponentAtNode(controller);
      controller = undefined;
    }
  });

  it('passes params extracted from URL into page component as props', function(done) {
    controller = createController({
      routes: {'/:param1/:param2': MainPage}
    });

    controller.render(root, '/abc/def', function(err, controller) {
      if (err) return done(err);

      assert.ok(controller.state.page);
      assert.equal(controller.state.page.props.param1, 'abc');
      assert.equal(controller.state.page.props.param2, 'def');
      done();
    });
  });

  it('does not render twice', function(done) {
    var counter = 0;

    var Page = React.createClass({
      render: function() {
        counter += 1;
        return React.DOM.div(null, 'hello');
      }
    });

    controller = createController({
      routes: {'/': Page}
    });

    controller.render(root, '/', function(err, controller) {
      assert.equal(counter, 1);
      done();
    });
  });

  describe('initial rendering and transitions', function() {

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

});
