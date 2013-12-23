require('es5-shim');

var assert            = require('assert');
var React             = require('react');
var NotFoundError     = require('../not-found-error');

var baseController      = require('../base');
var dataDriveConroller  = require('../data-driven');

function createCommonTestSuite(name, createController) {

  describe(name, function() {

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
            assert.ok(!err);
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

      it('allows rendering custom UI on NotFoundError', function(done) {
        controller = createController({
          routes: {},
          renderNotFound: function() {
            return React.DOM.div({className: 'NotFound'}, '404');
          }
        });

        controller.render(root, '/about', function(err, controller) {
          assert.ok(!err, err);
          assert.ok(document.querySelector('.NotFound'));
          assert.ok(controller.state.page === null);
          done();
        });
      });

    });
  });
}

createCommonTestSuite(
    'base controller on client (common test suite)',
    baseController);

createCommonTestSuite(
    'data-driven controller on client (common test suite)',
    dataDriveConroller);

describe('data-driven controller on client', function() {

  var MainPage = React.createClass({
    fetchData: function(req, cb) {
      cb(null, {message: 'mainmessage'});
    },

    render: function() {
      var msg = this.props.request.data ? this.props.request.data.message : 'NoNe';
      return React.DOM.div({className: 'MainPage'}, msg);
    }
  });

  var AboutPage = React.createClass({
    fetchData: function(req, cb) {
      cb(null, {message: 'aboutmessage'});
    },

    render: function() {
      var msg = this.props.request.data ? this.props.request.data.message : 'NoNe';
      return React.DOM.div({className: 'AboutPage'}, msg);
    }
  });

  var controller;
  var root = document.getElementById('root');

  beforeEach(function() {
    controller = dataDriveConroller({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });
  });

  afterEach(function() {
    if (controller !== undefined) {
      React.unmountComponentAtNode(controller);
      controller = undefined;
    }
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
        assert.ok(!err);
        assert.ok(!document.querySelector('.MainPage'));
        assert.ok(document.querySelector('.AboutPage'));
        assert.ok(controller.state.page);
        assert.ok(controller.state.request);
        assert.equal(controller.state.request.path, '/about');
        done();
      });
    });
  });
});
