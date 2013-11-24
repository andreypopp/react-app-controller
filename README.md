# react-app-controller

React application controller to manage top-level React components according to
window.location and History API.

## Installation

    % npm install react-app-controller

## Using in browser

You can use `react-app-controller` to control how components are rendered in
browser according to `window.location` and History API:

    var createController = require('react-app-controller');

    var controller = createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });

    // this will start listening for 'popstate' event and will mount the
    controller.render(document.body);

    // .navigate(url) can be used to navigate to a specified URL
    controller.navigate('/about');

    // .navigateQuery(obj) can be used to update query string values
    controller.navigateQuery({search: 'term'});

## Usage on server

The same controller can be used to pre-generate UI markup on server:

    var createController = require('react-app-controller');

    var controller = createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });

    controller.renderToString('/about', function(err, markup) {
      // serve markup to a client
    });
