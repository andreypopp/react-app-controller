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

describe('react-app-controller', function() {

  it('renders markup of matched component', function(done) {
    var controller = createController({
      '/': MainPage,
      '/about': AboutPage
    });

    controller.generateMarkup('/about', function(err, markup) {
      assert.ok(!err);
      assert.ok(/AboutPage/.exec(markup));
      done();
    });
  });
});
