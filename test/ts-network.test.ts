import {
  isNotRequested,
  isRequesting,
  isSucceeded,
  isFailed,
  isRefreshing,
  isRefreshFailed,
  getNotRequested,
  getRequesting,
  getSucceeded,
  getFailed,
  getRefreshing,
  getRefreshFailed
} from '../src/ts-network'

it('isXXX works', () => {
  expect(isNotRequested({ kind: 'not-requested' })).toBe(true)
  expect(isRequesting({ kind: 'requesting' })).toBe(true)
  expect(isSucceeded({ kind: 'succeeded', data: 'data' })).toBe(true)
  expect(isFailed({ kind: 'failed', error: 'error' })).toBe(true)
  expect(isRefreshing({ kind: 'refreshing', prevData: 'data' })).toBe(true)
  expect(
    isRefreshFailed({
      kind: 'refresh-failed',
      prevData: 'data',
      error: 'error'
    })
  ).toBe(true)
})

it('getXXX works', () => {
  expect(isNotRequested(getNotRequested())).toBe(true)
  expect(isRequesting(getRequesting())).toBe(true)
  expect(isSucceeded(getSucceeded('data'))).toBe(true)
  expect(isFailed(getFailed('error'))).toBe(true)
  expect(isRefreshing(getRefreshing('data'))).toBe(true)
  expect(isRefreshFailed(getRefreshFailed('data', 'error'))).toBe(true)
})
