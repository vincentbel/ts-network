export interface NotRequested {
  kind: 'not-requested'
}

export interface Requesting {
  kind: 'requesting'
}

export interface Failed<E> {
  kind: 'failed'
  error: E
}

export interface Succeeded<D> {
  kind: 'succeeded'
  data: D
}

export interface Refreshing<D> {
  kind: 'refreshing'
  prevData: D
}

export interface RefreshFailed<D, E> {
  kind: 'refresh-failed'
  prevData: D
  error: E
}

export type NetworkState<D, E> =
  | NotRequested
  | Requesting
  | Succeeded<D>
  | Failed<E>

export type RefreshableNetworkState<D, E> =
  | NotRequested
  | Requesting
  | Succeeded<D>
  | Failed<E>
  | Refreshing<D>
  | RefreshFailed<D, E>

export type AllNetworkState<D, E> =
  | RefreshableNetworkState<D, E>
  | NetworkState<D, E>

const NOT_REQUEST_STATE = { kind: 'not-requested' as 'not-requested' }
const REQUESTING_STATE = { kind: 'requesting' as 'requesting' }

export function getNotRequested(): NotRequested {
  return NOT_REQUEST_STATE
}

export function getRequesting(): Requesting {
  return REQUESTING_STATE
}

export function getSucceeded<D>(data: D): Succeeded<D> {
  return {
    kind: 'succeeded',
    data
  }
}

export function getFailed<E>(error: E): Failed<E> {
  return {
    kind: 'failed',
    error
  }
}

export function getRefreshing<D>(prevData: D): Refreshing<D> {
  return {
    kind: 'refreshing',
    prevData
  }
}

export function getRefreshFailed<D, E>(
  prevData: D,
  error: E
): RefreshFailed<D, E> {
  return {
    kind: 'refresh-failed',
    prevData,
    error
  }
}

export function isNotRequested(
  state: AllNetworkState<any, any>
): state is NotRequested {
  return state.kind === 'not-requested'
}

export function isRequesting(
  state: AllNetworkState<any, any>
): state is Requesting {
  return state.kind === 'requesting'
}

export function isSucceeded<D>(
  state: AllNetworkState<D, any>
): state is Succeeded<D> {
  return state.kind === 'succeeded'
}

export function isFailed<E>(
  state: AllNetworkState<any, E>
): state is Failed<E> {
  return state.kind === 'failed'
}

export function isRefreshing<D>(
  state: RefreshableNetworkState<D, any>
): state is Refreshing<D> {
  return state.kind === 'refreshing'
}

export function isRefreshFailed<D, E>(
  state: RefreshableNetworkState<D, E>
): state is RefreshFailed<D, E> {
  return state.kind === 'refresh-failed'
}
