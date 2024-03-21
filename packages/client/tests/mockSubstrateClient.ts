import {
  ChainHead,
  FollowEventWithRuntime,
  StorageItemInput,
  StorageItemResponse,
  StorageResult,
  SubstrateClient,
} from "@polkadot-api/substrate-client"
import { noop } from "@polkadot-api/utils"
import { Mock, expect, vi } from "vitest"
import { DeferredPromise, WithWait, deferred, withWait } from "./spies"

export interface MockSubstrateClient extends SubstrateClient {
  chainHead: MockChainHead
}

export const createMockSubstrateClient = (): MockSubstrateClient => {
  const chainHead = createMockChainHead()

  return {
    _request: notImplemented,
    chainHead,
    transaction: notImplemented,
    destroy: noop,
    request: notImplemented,
  }
}

interface MockChainHeadMocks {
  unpinnedHashes: Set<string>
  body: MockOperationFn<[string, AbortSignal | undefined], string[]>
  call: MockOperationFn<
    [string, string, string, AbortSignal | undefined],
    string
  >
  header: MockOperationFn<[string], string>
  storage: MockOperationFn<
    [
      string,
      StorageItemInput["type"],
      string,
      string | null,
      AbortSignal | undefined,
    ],
    StorageResult<StorageItemInput["type"]>
  >
  storageSubscription: MockStorageSubscription
  unfollow: Mock<[], void>
  unpin: WithWait<Mock<[string[]], Promise<void>>>
  send: (evt: FollowEventWithRuntime) => void
  sendError: (error: Error) => void
}
interface MockChainHead extends ChainHead {
  mock: MockChainHeadMocks
}

const createMockChainHead = (): MockChainHead => {
  const unpinnedHashes = new Set<string>()
  let active: {
    cb: (evt: FollowEventWithRuntime) => void
    onError: (error: Error) => void
  } | null = null

  const mock: MockChainHeadMocks = {
    unpinnedHashes,
    body: createMockPromiseFn(),
    call: createMockPromiseFn(),
    header: createMockPromiseFn(),
    storage: createMockPromiseFn(),
    storageSubscription: createMockStorageSubscription(),
    unfollow: vi.fn(),
    unpin: withWait(
      vi.fn(async (hashes) => {
        hashes.forEach((hash) => {
          if (unpinnedHashes.has(hash)) {
            throw new Error("Called unpin on a block previously unpinned")
          }
          unpinnedHashes.add(hash)
        })
      }),
    ),
    send: (evt: FollowEventWithRuntime) => {
      if (!active) {
        throw new Error("No one subscribed to chainHead")
      }
      active.cb(evt)
    },
    sendError: (error: Error) => {
      if (!active) {
        throw new Error("No one subscribed to chainHead")
      }
      const prevActive = active
      active = null
      prevActive.onError(error)
    },
  }

  const chainHead: ChainHead = (_, cb, onError) => {
    if (active) {
      throw new Error("Mock doesn't support multiple chainHead subscriptions")
    }
    active = { cb, onError }

    return {
      _request: notImplemented,
      body: mock.body,
      call: mock.call,
      header: mock.header,
      storage: mock.storage as any,
      storageSubscription: mock.storageSubscription,
      unfollow: mock.unfollow,
      unpin: mock.unpin,
    }
  }

  return Object.assign(chainHead, { mock })
}

type MockOperationFn<T extends any[], R> = Mock<T, DeferredPromise<R>> & {
  getAllCalls: (hash: string) => T[]
  getLastCall: (hash: string) => T
  reply: (hash: string, response: R | Promise<R>) => Promise<void>
}
const createMockPromiseFn = <
  T extends [string, ...any[]],
  R,
>(): MockOperationFn<T, R> => {
  const spy = vi.fn((..._: T) => deferred<R>())

  function getLastCallIdx(hash: string) {
    const idx = spy.mock.calls.findLastIndex((v) => v[0] === hash)
    if (idx < 0) {
      throw new Error("No call received for " + hash)
    }
    return idx
  }

  return Object.assign(spy, {
    getAllCalls: (hash: string) => spy.mock.calls.filter((v) => v[0] === hash),
    getLastCall: (hash: string) => spy.mock.calls[getLastCallIdx(hash)],
    reply: async (hash: string, response: R | Promise<R>) => {
      const result = spy.mock.results[getLastCallIdx(hash)]
      if (result.type !== "return") {
        throw new Error("Unreachable")
      }
      const deferred = result.value

      await Promise.resolve(response).then(deferred.res, deferred.rej)
      // Wait for the consumer of the promise to receive the message
      await Promise.resolve()
    },
  })
}

type StorageSubscriptionArgs = [
  string,
  Array<StorageItemInput>,
  string | null,
  (items: Array<StorageItemResponse>) => void,
  (error: Error) => void,
  () => void,
  (nDiscarded: number) => void,
]
type MockStorageSubscription = Mock<StorageSubscriptionArgs, Mock<any, any>> & {
  getCall: (idx: number) => StorageSubscriptionCall
  getLastCall: (hash: string) => StorageSubscriptionCall
}
interface StorageSubscriptionCall {
  args: StorageSubscriptionArgs
  cleanupFn: Mock<[], void>
  sendItems: (items: Array<StorageItemResponse>) => StorageSubscriptionCall
  sendError: (error: Error) => StorageSubscriptionCall
  sendComplete: () => StorageSubscriptionCall
  sendDiscarded: (nDiscarded: number) => StorageSubscriptionCall
}
const createMockStorageSubscription = (): MockStorageSubscription => {
  const spy = vi.fn((..._: StorageSubscriptionArgs) => vi.fn())

  function getCall(idx: number): StorageSubscriptionCall {
    expect(
      spy.mock.calls.length,
      `Expected function to have been called at least ${idx + 1} times`,
    ).toBeGreaterThan(idx)
    const args = spy.mock.calls[idx]
    const [, , , onItems, onError, onDone, onDiscardedItems] = args

    const result: StorageSubscriptionCall = {
      args,
      cleanupFn: spy.mock.results[idx].value,
      sendComplete: chain(onDone),
      sendDiscarded: chain(onDiscardedItems),
      sendError: chain(onError),
      sendItems: chain(onItems),
    }
    return result

    function chain<T extends any[]>(fn: (...args: T) => void) {
      return (...args: T) => {
        fn(...args)
        return result
      }
    }
  }
  function getLastCallIdx(hash: string) {
    const idx = spy.mock.calls.findLastIndex((v) => v[0] === hash)
    if (idx < 0) {
      throw new Error("No call received for " + hash)
    }
    return idx
  }

  const result = Object.assign(spy, {
    getCall,
    getLastCall: (hash: string) => getCall(getLastCallIdx(hash)),
  })
  return result
}

const notImplemented = () => {
  throw new Error("Mock not implemented")
}
