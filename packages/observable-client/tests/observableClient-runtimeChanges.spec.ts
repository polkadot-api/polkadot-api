import { getObservableClient } from "@/index"
import { ChainHead, DisjointError } from "@polkadot-api/substrate-client"
import { afterEach, describe, expect, it, vi } from "vitest"
import {
  createHeader,
  encodeHeader,
  newHash,
  sendInitialized,
  wait,
} from "./fixtures"
import {
  createMockSubstrateClient,
  MockSubstrateClient,
} from "./mockSubstrateClient"
import { observe } from "./observe"
import { deferred } from "./spies"

// Each letter is the `:code` of one block of the `initialized` event
const toCodeHashes = (pattern: string) =>
  pattern.split("").map((x) => "0x" + x.charCodeAt(0).toString(16))

// Above this amount of `:code` lookups, the mock stops answering
const MAX_LOOKUPS = 100

const initializeWithCodes = async (
  mockClient: MockSubstrateClient,
  pattern: string,
) => {
  const finalizedBlockHashes = pattern.split("").map(() => newHash())
  const codeHashes = toCodeHashes(pattern)
  const codeHashByBlock = new Map(
    finalizedBlockHashes.map((hash, idx) => [hash, codeHashes[idx]]),
  )

  const { storage } = mockClient.chainHead.mock
  storage.mockImplementation((hash) => {
    const result = deferred<any>()
    if (storage.mock.calls.length <= MAX_LOOKUPS)
      result.res(codeHashByBlock.get(hash))
    return result
  })

  sendInitialized(mockClient, { finalizedBlockHashes })
  await mockClient.chainHead.mock.header.reply(
    finalizedBlockHashes[0],
    encodeHeader(createHeader({ number: 10 })),
  )
  await wait()

  return {
    finalizedBlockHashes,
    codeHashes,
    lookups: storage.mock.calls.map(([hash]) => hash),
  }
}

describe("observableClient runtime changes on initialized", () => {
  it.each([
    "aab",
    "abb",
    "abc",
    "aaaaabbbbbbbbbbb",
    "aaaabbbbccccdddd",
    "abbbbbbbbbbbbbbb",
    "aaaaaaaaaaaaaaab",
  ])("finds the runtime changes of %s in bounded lookups", async (pattern) => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { finalizedBlockHashes, codeHashes, lookups } =
      await initializeWithCodes(mockClient, pattern)

    expect(lookups.length).toBeLessThanOrEqual(pattern.length)
    expect(new Set(lookups).size).toBe(lookups.length)

    const { blocks, runtimes } = chainHead.pinnedBlocks$.state
    expect(
      finalizedBlockHashes.map((hash) => blocks.get(hash)?.runtime),
    ).toEqual(codeHashes)
    new Set(codeHashes).forEach((codeHash) =>
      expect(runtimes[codeHash]).toBeDefined(),
    )

    chainHead.unfollow()
  })

  it.each([
    ["aab", [0, 2]],
    ["abb", [0, 1]],
    ["aaaaabbbbbbbbbbb", [0, 5]],
    ["aaaabbbbccccdddd", [0, 4, 8, 12]],
  ] as const)(
    "keeps the first finalized block of %s in the runtime changes",
    async (pattern, changeIdxs) => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()
      const follow = observe(chainHead.follow$)

      const { finalizedBlockHashes, codeHashes } = await initializeWithCodes(
        mockClient,
        pattern,
      )

      const initialized = follow.next.mock.calls
        .map(([event]) => event)
        .find((event) => event.type === "initialized")
      expect(initialized?.runtimeChanges).toEqual(
        new Map(
          changeIdxs.map((idx) => [finalizedBlockHashes[idx], codeHashes[idx]]),
        ),
      )

      chainHead.unfollow()
    },
  )

  describe("unfollow", () => {
    afterEach(() => {
      vi.useRealTimers()
      vi.restoreAllMocks()
    })

    // Leaves the runtime-changes search waiting for the `:code` of a block in
    // between the first and the last finalized blocks
    const startRuntimeLookup = async (mockClient: MockSubstrateClient) => {
      const follow = vi.fn((...args: Parameters<ChainHead>) =>
        mockClient.chainHead(...args),
      )
      const client = getObservableClient({
        ...mockClient,
        chainHead: follow as ChainHead,
      })
      const chainHead = client.chainHead$()

      const finalizedBlockHashes = Array.from({ length: 16 }, newHash)
      const [codeA, codeB] = toCodeHashes("ab")
      sendInitialized(mockClient, { finalizedBlockHashes })
      await mockClient.chainHead.mock.header.reply(
        finalizedBlockHashes[0],
        encodeHeader(createHeader({ number: 10 })),
      )
      await mockClient.chainHead.mock.storage.reply(
        finalizedBlockHashes[0],
        codeA,
      )
      await mockClient.chainHead.mock.storage.reply(
        finalizedBlockHashes[15],
        codeB,
      )

      const pending = mockClient.chainHead.mock.storage.mock.calls.at(-1)![0]
      expect(finalizedBlockHashes.slice(1, -1)).toContain(pending)

      return { chainHead, pending, follow }
    }

    it("doesn't retry nor follow again when unfollowed during the runtime lookup", async () => {
      vi.useFakeTimers()
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
      const mockClient = createMockSubstrateClient()
      const { chainHead, pending, follow } =
        await startRuntimeLookup(mockClient)

      chainHead.unfollow()
      expect(mockClient.chainHead.mock.unfollow).toHaveBeenCalledOnce()

      // unfollowing rejects the ongoing operations
      await mockClient.chainHead.mock.storage.reply(
        pending,
        Promise.reject(new DisjointError()),
      )

      // A retry would subscribe to `chainHead` again, which the mock rejects
      expect(() => vi.advanceTimersByTime(1_000)).not.toThrow()
      expect(warn).not.toHaveBeenCalled()
      expect(follow).toHaveBeenCalledOnce()
    })

    it("doesn't follow again from a retry scheduled before unfollowing", async () => {
      vi.useFakeTimers()
      vi.spyOn(console, "warn").mockImplementation(() => {})
      const mockClient = createMockSubstrateClient()
      const { chainHead, pending, follow } =
        await startRuntimeLookup(mockClient)

      // schedules a retry of the subfollow requests
      await mockClient.chainHead.mock.storage.reply(
        pending,
        Promise.reject(new Error("request failed")),
      )
      // schedules a retry of the follow subscription, whose timer replaces the
      // one that `unfollow` clears
      mockClient.chainHead.mock.sendError(new Error("follow failed"))

      chainHead.unfollow()

      vi.advanceTimersByTime(1_000)
      expect(follow).toHaveBeenCalledOnce()
    })
  })
})
