# react-app-controller

React application controller to manage top-level React components according to
window.location and History API.

## Installation

    % npm install react-app-controller

## Client side usage

You can use `react-app-controller` to control how components are rendered in
browser according to `window.location` and History API:

    var createController = require('react-app-controller');

    var controller = createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });

Now `controller` is essentially a React component (one you would usually create
with `React.createClass(...)` function).

Instead of instantiating this component directly we use `.render()` method which
takes DOM element as an argument. This function does the same as
`React.renderComponent(...)` but provides asynchronous API on top of it.

    // this will start listening for 'popstate' event and will mount the
    // controller's
    controller.render(document.body, function(err, controller) {
      // controller instantiated and rendered into DOM
    });

Now `controller` is fully functional, it listens to `popstate` event and react
accordingly.

There are also few useful methods — `.navigate()` and `.navigateQuery()`:

    // .navigate(url) can be used to navigate to a specified URL
    controller.navigate('/about');

    // .navigateQuery(obj) can be used to update query string values
    controller.navigateQuery({search: 'term'});

Both these methods also call `window.pushState` so browser location will be
updated accordingly.

## Server side usage

The same controller can be used to pre-generate UI markup on server:

    var createController = require('react-app-controller');

    var controller = createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });

Method `.renderToString` takes a string argument and produces markup
asynchronously:

    controller.renderToString('/about', function(err, markup) {
      // serve markup to a client
    });

## Overriding .render(...) method

Controllers are React components but they have `.render()` method
implemented by default. It looks like this:

    render: function() {
      return React.DOM.div(null, this.state.page);
    }

Note the `this.state.page`, it is the currently active component according to
`window.location` and routing table (`routes` attribute you passed as a part of
a controller specification in `createController`).

You can override the `.render()` by own implementation, just pass it as a part
of controller specification into `createController`.
