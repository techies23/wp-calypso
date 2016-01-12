Server Side Rendering
======

Something something on the server.

```
{
	"main": "index.node.js",
	"browser": "index.web.js"
}
```
Occasionally, it may be necessary to conditionally do something client-specific inside an individual source file.

#### Shared React Components

React components used on the server will be rendered to HTML by being passed to a [renderToString()](https://facebook.github.io/react/docs/top-level-api.html#reactdomserver.rendertostring) call, which calls `componentWillMount()` and `render()` _once_. This means that any components in the `shared` folder need to satisfy the following constraints:
* Must not rely on event handling for the initial render
* Must not hook up any change listeners, or do anything asynchronous, inside `componentWillMount()`
* All data must be available before the initial render
* Mutating class level variables should be avoided, as they will be persisted until a server restart
* Must not change component ID during `componentWillMount`
* Must not assume that the DOM/BOM exists in `render()` and `componentWillMount()`

#### Shared Libraries

* Libraries that are used on the server should be mindful of the DOM not being available on the server, and should either: be modified to work without the DOM; have non-DOM specific fallbacks; or fail in an obvious manner.
* Singletons should be avoided, as once instantiated they will persist for the entire duration of the `node` process.
