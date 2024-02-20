import {
  ChainHead,
  FollowEventWithRuntime,
  StorageItemInput,
  StorageResult,
  SubstrateClient,
} from "@polkadot-api/substrate-client"
import { noop } from "@polkadot-api/utils"
import { Mock, vi } from "vitest"
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
  hasUnpinned: (hash: string) => boolean
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
    hasUnpinned: (hash) => unpinnedHashes.has(hash),
    body: createMockPromiseFn(),
    call: createMockPromiseFn(),
    header: createMockPromiseFn(),
    storage: createMockPromiseFn(),
    unfollow: vi.fn(),
    unpin: withWait(
      vi.fn(async (hashes) => {
        hashes.forEach((hash) => unpinnedHashes.add(hash))
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
      active.onError(error)
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
      storageSubscription: notImplemented,
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

const notImplemented = () => {
  throw new Error("Mock not implemented")
}
