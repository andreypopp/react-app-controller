# react-app-controller

React application controller to manage top-level React components according to
window.location and History API.

## Installation

    % npm install react-app-controller

## Using in browser

You can use `react-app-controller` to control how components are rendered in
browser according to `window.location` and History API:

    var createController = require('react-app-controller');

    var routes = {
      '/': MainPage,
      '/about': AboutPage
    }

    var controller = createController(routes, {
      // optional, callback which will be executed once the controller started
      // its operation
      started: function() { ... },

      // optional, the DOM element to mount component to (document.body is used
      // by default).
      mountPoint: document.body,

      // optional, options object which will be passed to a created component as
      // 'options' prop
      options: ...,

      // advanced, optional, function to render component into specified DOM
      // element
      renderComponent: function(component, element, request, cb) { ... },

      // advanced, optional, function to render component into markup
      renderComponentToString: function(component, request, cb) { ... }
    });

    // this will start listening for 'popstate' event and will mount the
    controller.start();

    // .navigate(url) can be used to navigate to a specified URL
    controller.navigate('/about');

    // .navigateQuery(obj) can be used to update query string values
    controller.navigate({search: 'term'});

    // call .stop() if you want to stop listening for 'popstate'
    controller.stop();

## Usage on server

The same controller can be used to pre-generate UI markup on server:

    var createController = require('react-app-controller');

    var routes = {
      '/': MainPage,
      '/about': AboutPage
    }

    var controller = createController(routes);

    controller.generateMarkup('/about', function(err, markup) {
      // serve markup to a client
    });
