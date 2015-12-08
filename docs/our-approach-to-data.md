Our Approach to Data
====================

Throughout Calypso's development, our approach to handling data has evolved to allow us to better adapt to the scale at which the application has grown. These shifts have not been unanimously adopted throughout the codebase, so you'll occasionally encounter legacy code which is not consistent with our current recommendations. The purpose of this document is to outline a history of these approaches such that you as the developer can understand the differences between each. Further, it seeks to prescribe our current set of recommendations with regard to data management.

## History

There have been three major "eras" of data management throughout the lifetime of Calypso's development. Below, you will find a description of each, common identifying features, and reasons it was adopted in favor of the previous approach.

### Era One: Emitter Objects (June 2014 - April 2015)

Our original approach to managing data took an object-oriented approach, wherein an instance of the store would inherit the [`EventEmitter` interface](https://nodejs.org/api/events.html#events_inheriting_from_eventemitter). Typically, a single instance of each object store was shared across the entire application. The instance was responsible for storing data, but included conveniences to automatically fetch data if none currently existed. Used in combination with the [`data-observe` mixin](../client/lib/mixins/data-observe), a developer could monitor an instance of the store passed as a prop to a React component to automatically re-render its contents if the store emitted a `change` event.

__Identifying characteristics:__

- Module directories live in `lib` and are suffixed with `-list`
- Index file exports a common shared instance of the object prototype
- A `list.js` file includes the object prototype methods
- The list contains a `get` method which triggers a fetch if no data exists
- Used with the [`data-observe` mixin](../client/lib/mixins/data-observe) in a React component

### Era Two: Facebook Flux (April 2015 - December 2015)

Facebook's [Flux architecture](https://facebook.github.io/flux/) is a pattern that encourages a [unidirectional data flow](https://facebook.github.io/flux/img/flux-simple-f8-diagram-explained-1300w.png) in which stores can only be manipulated via actions dispatched by a global dispatcher object. The raw data is never exposed by the store module, and as such, data can only be accessed by using helper ("getter") methods from the exported object. Similar to the event emitter object approach, a Flux store module inherits from the [`EventEmitter` interface](https://nodejs.org/api/events.html#events_inheriting_from_eventemitter), though by convention, a store should only ever emit a `change` event (this was common but not as strictly enforced in our emitter objects). Stores subscribe to the dispatcher and listen for actions it is concerned with. Action creators are responsible for dispatching these actions. As an example, it is common to have an action creator that triggers a fetch for data - this action creator would dispatch a `FETCH_` prefixed "view" action upon the initial request, then subsequently a `RECEIVE_` prefixed "server" action upon receiving the data. Any store in the application could react to one or both of these action types.

__Identifying characteristics:__

- Module directories live in `lib`
- Modules contain `actions.js` and at least one store (named or suffixed `store.js`)
- Actions dispatch view or server actions on the global `Dispatcher` object
- Stores include a top-level object for data storage, which is not directly exported
- Stores export a number of helper getter functions for accessing known data
- Stores register on the Dispatcher object, manipulating data in response to action types it is concerned with

__Advantages:__

- Stores can be specialized to their specific needs since dispatched actions are run against all subscribing stores
- There is a single entry point by which data can enter the store. This is easier to manage as an application scales
- Data logic (e.g. fetching) is not intertwined with the storage of the data
- Adopting an accepted pattern grants us access to a community-driven ecosystem of reference implementations

### Era Three: Redux Global State Tree (December 2015 - Present)

[Redux](http://redux.js.org/), described as a "predictable state container", is an evolution of the principles advocated in Flux. It is not a far departure from Flux, but is unique in many ways:

- There is typically only a single store instance, which maintains all state for the entire application
- Action creators do not call to the global dispatcher directly, but rather return simple action objects which can be passed to the [store `dispatch` method](http://rackt.org/redux/docs/api/Store.html#dispatch)
- While Flux Stores are responsible for maintaining own state, Redux reducers are composable functions that manipulate specific parts of the global state "tree"
- Since state is the [single source of truth](http://rackt.org/redux/docs/introduction/ThreePrinciples.html#single-source-of-truth) for the entire application, reducers tend to be much simpler and more transparent than Flux stores

__Identifying characteristics:__

- Files exist within the `state` directory, mirroring the structure of the global tree
- React bindings use [`react-redux`](https://github.com/rackt/react-redux) `connect`

__Advantages:__

- An arguably simpler abstraction to the same problems addressed by Facebook’s Flux implementation
- Better suited for server-side rendering, as the singleton nature of Flux stores exposes the risk of leaking session data between requests
- Encourages and often forces a developer toward writing functional, testable code
- Extendable, supporting middlewares to suit our specific needs and [conveniences for use with React](https://github.com/rackt/react-redux)

## Current Recommendations

All new data stores should be implemented as part of the global Redux state tree. The `client/state` directory contains all of the behavior describing the global application state. The folder structure of the `state` directory should directly mirror the sub-trees within the global state tree. Each sub-tree can include their own set of actions, reducers, and selectors.

### Terminology

__WIP__

http://redux.js.org/docs/Glossary.html

- Global state (state tree):
- Store instance:
- Action creators:
- Actions:
- Reducers:
- Selectors:

### Folder Structure

The root module of the `state` directory exports a single reducer function. We leverage [Redux's `combineReducers` function](http://redux.js.org/docs/api/combineReducers.html) to separate data concerns into their own piece of the overall state. These pieces are reflected by the folder structure of the `state` directory, as shown in the hierarchy below:

```text
client/state/
├── index.js
└── { subject }/
    ├── action-types.js
    ├── actions.js
    ├── reducer.js
    ├── selectors.js
    ├── Makefile
    ├── README.md
    └── test/
       ├── actions.js
       ├── reducer.js
       └── selectors.js
```

For example, the reducer responsible for maintaining the `state.sites` key within the global state can be found in `client/state/sites/reducer.js`. It's quite common that the subject reducer is itself a combined reducer. Just as it helps to split the global state into subdirectories responsible for their own part of the tree, as a subject grows, you may find that it's easier to maintain pieces as nested subdirectories. This composability is one of Redux's strengths.

### Data Normalization

Because a Redux store is a [single source of truth](http://rackt.org/redux/docs/introduction/ThreePrinciples.html#single-source-of-truth) for the entire application state, it is important that all known data be tracked within the state tree and that it be well-structured. In your reducer functions, consider the data being manipulated in the tree and ensure that subjects are appropriately separated to avoid duplicated data and synchronization concerns. When a subject needs to refer to another part of the tree, store a reference (likely an ID). Tracking an indexed set of items makes it easy to navigate the tree when needing to perform a lookup.

As an example, consider that there are many variations of a "user" in the application. A user may be the current user, a subscriber to a site, or someone who has left a comment on a story in your Reader feed. Each of these display user data in different ways, and in some cases retrieve the data from different sources. However, they can all be classified as a user, and relations between the user and a display context can be established through references.

The following state tree demonstrates how users, sites, and posts may be interrelated, but the data can be normalized in a way such that it is always kept in sync, avoiding duplication, and facilitating lookup.

```json
{
	"users": {
		"items": {
			73705554: {
				"ID": 73705554,
				"login": "testonesite2014"
			}
		}
	},
	"sites": {
		"items": {
			2916284: {
				"ID": 2916284,
				"name": "WordPress.com Example Blog",
				"description": "Just another WordPress.com weblog",
			}
		},
		"siteUsers": {
			2916284: {
				73705554: {
					"roles": [ "administrator" ]
				}
			}
		}
	},
	"posts": {
		"items": {
			34: {
				"site_ID": 2916284,
				"author_ID": 73705554
			}
		}
	}
}
```

### Container Components

__WIP__

- Top-level fetching component
  - Goals to remove this concern from the developer such that they can concern themselves only with the data needs of their component
- React bindings with `react-redux`
  - Proper usage of `mapStateToProps` (data), `mapDispatchToProps` (behavior)
- "Smart" vs "dumb" components
  - When to split visual from connected components

### Selectors

__WIP__

- Shortcutting vs Derived/computed data
  - Leaning towards computed properties as object getters, or reducer sub-keys
- Always pass entire state object to selectors
  - Cross-tree referencing

### Derived Data

__WIP__

- Can/should we use [JavaScript object getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) as part of the state tree in creating computed properties?
  - Example: http://jsbin.com/sozukoruhu/edit?js,console

### UI State

__WIP__

- When is it appropriate to use React state?
- Examples of UI state that persist between page transitions
  - Selected site
