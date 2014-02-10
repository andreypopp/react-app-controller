# react-app-controller

**DEPRECATION WARNING:** This is not maintained anymore, please use
[react-router-component](https://github.com/andreypopp/react-router-component)
instead.

Application controller component for [React][1].

It keeps track of `window.location` (via History API) and renders UI according
to its routes table. It can be used both on client and server.

[1]: https://facebook.github.io/react

## Installation

Install via npm:

    % npm install react-app-controller

You certainly will need to install React itself:

    % npm install react

## Creating a controller

You can use `react-app-controller` to control how components are rendered in
browser according to `window.location`:

    var React = require('react');
    var createController = require('react-app-controller');

    var MainPage = React.createClass({
      ...
    });

    var AboutPage = React.createClass({
      ...
    });

    var controller = createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });

Instantiated `controller` is essentially a React component (one you would
usually create with `React.createClass(...)` function).

## Client side usage

When we are ready to start our controller in a browser we use its `.render()`
static method instead of `React.renderComponent`.

    controller.render(document.body, function(err, controller) {
      // controller instantiated and rendered into DOM
    });

Now `controller` is fully functional, it listens to `popstate` event and react
accordingly.

### Transitions to different routes

Method `.navigate(url)` can be used to navigate to a specified URL:

    controller.navigate('/about');

Another method `.navigateQuery(obj)` can be used to update just the current
query string values:

    controller.navigateQuery({search: 'term'});

Both these methods call `window.pushState(..)` internally so browser location
will be updated accordingly.

You probably would want to use these methods when some event occurs like
clicking an anchor element.

## Server side usage

The same controller can be used to pre-generate UI markup on a server:

    var createController = require('react-app-controller');

    var controller = createController({
      routes: {
        '/': MainPage,
        '/about': AboutPage
      }
    });

Method `.renderToString(url, cb)` takes a URL and produces corresponding markup
asynchronously:

    controller.renderToString('/about', function(err, markup) {
      // serve markup to a client
    });

## Handling NotFoundError

When no route is matched for a specified URL you can define
`renderNotFound()` method to generate UI for this case:

    var controller = createController({
      routes: {
        ...
      },

      renderNotFound: function() {
        return (
          <div className="NotFound">
            Sorry, no item could be found for a specified request.
          </div>
        );
      }
    });

If no `renderNotFound()` was defined and condition occurs then `NotFoundError`
will be thrown.

## Overriding .render() method

Controllers are React components but they have `.render()` method
implemented by default. It looks like this:

    render: function() {
      return React.DOM.div(null, this.state.page);
    }

Note the `this.state.page`, it is the currently active component according to
`window.location` and routing table (`routes` attribute you passed as a part of
a controller specification in `createController`).

In case there were no matches for a current URL then `this.state.page` will be
`null`. You should handle this case according your needs.

You can override the `.render()` by own implementation, just pass it as a part
of controller specification into `createController`.
