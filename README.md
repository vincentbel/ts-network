# TypeScript Network Types

[![Travis](https://img.shields.io/travis/VincentBel/ts-network.svg)](https://travis-ci.org/VincentBel/ts-network)
[![Coveralls](https://img.shields.io/coveralls/VincentBel/ts-network.svg)](https://coveralls.io/github/VincentBel/ts-network)
[![Dev Dependencies](https://david-dm.org/VincentBel/ts-network/dev-status.svg)](https://david-dm.org/VincentBel/ts-network?type=dev)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript datatype representing network state which taking advantage of [discriminated unions](https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions) (or tagged unions, algebraic data types).

## The Problem

When representing network state, the following data structure is commonly used:

```js
var state = {
  isFetching: true, // whether we are fetching the data
  data: [],         // the data we fetched
  error: {},        // failed to fetch the data, but got an error
}
```

We may raise the following questions:

* What does it mean if `isFetching === true` and `error` field also exists? Refetching after failed? Can it mean something else?
* What does it mean if all of the three fields exist?
* When rendering the UI, which field should I read first?
* How can I distinguish between initial page(not requested) and empty page(response with empty data)? by checking `data === null` or `data.length === 0`?

As we can see, it is **hard to reason about** by using this data structure, and it exists some **impossible state**.

## A Solution

The above data structure is not a good model of the network state. Actually, network states are consist of:

* haven't start the request(`NotRequested`)
* the request started, and haven't get the response yet(`Requesting`)
* the request succeeded, responded with some data(`Succeeded`)
* the request failed, responded with error(`Failed`)

And in some cases, we can refresh the data:

* refreshing by restart the request after succeeded(`Refreshing`)
* refresh succeeded, got the new data(`RefreshSucceeded`)
* refresh failed, got an error(`RefreshFailed`)

This is how this library trying to solve the problem. See the solution at the following Usage section.

## Usage

```ts
import {
  NetworkState,
  getNotRequested,
  getRequesting,
  getSucceeded,
  getFailed,
} from 'ts-network'

type User = {
  id: number
  name: string
  email: string
}

type NetworkError = {
  statusCode: number
  message: number
}

type UserListRequestState = NetworkState<User[], NetworkError>

// How to set the state
function getUserListRequestState(action: Action) {
  switch (action.type) {
    case 'user-list-request-started':
      return getRequesting()
    case 'user-list-request-succeeded':
      return getSucceeded(action.response)
    case 'user-list-request-failed':
      return getFailed(action.error)
    default:
      return getNotRequested()
  }
}

// How to use the state to render UI
function render(userListRequest: UserListRequestState): UIElement {
  switch (userListRequest.kind) {
    case 'not-requested':
    // render initial page
    case 'requesting':
    // render loading page
    case 'succeeded':
    // render user list by using `userListRequest.data`
    case 'failed':
    // render error message by using `userListRequest.error`

    // TypeScript will raise an error if you misspell the case (like `case 'fialed':`).
    // You can skip the `default` case if you have already checked all the kinds.
    // And if you only check some kinds and without the `default` case, TypeScript
    // will raise an error. (You should turn on `strictNullChecks` first)
  }
}
```

## API

See <https://vincentbel.github.io/ts-network>.

## FAQ

**Why are there no `RefreshSucceeded` state?**

Because in common use case, after refreshing succeeded, we will rerender the UI with the new data we fetched, and turning the UI to `Succeeded` state waiting for another refreshing. So, using `Succeeded` state is enough.

If in your special case you need to store the previous data after refreshing succeeded, you should construct your own network state. like

```ts
interface RefreshSucceeded<D> {
  kind: 'refresh-succeed'
  prevData: D
  data: D
}

type MySpecialNetworkState<D, E> =
  | NotRequested
  // ...
  | RefreshingSucceeded<D>
```

## Thanks

This library is largely inspired by the post [How Elm Slays a UI Antipattern](http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html). And the talk [Making Impossible States Impossible](https://www.youtube.com/watch?v=IcgmSRJHu_8) is great to watch.

## License

[MIT](./LICENSE).
