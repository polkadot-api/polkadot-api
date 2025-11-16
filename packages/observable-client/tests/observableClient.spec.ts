import { BlockInfo, getObservableClient } from "@/index"
import { OperationLimitError } from "@polkadot-api/substrate-client"
import { describe, expect, it } from "vitest"
import {
  initialize,
  newHash,
  sendBestBlockChanged,
  sendFinalized,
  sendNewBlock,
  sendNewBlockBranch,
  setReady,
  wait,
} from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"

describe("observableClient chainHead", () => {
  describe("finalized$", () => {
    it("emits the latest finalized block after initialization", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const { next, error, complete } = observe(client.chainHead$().finalized$)

      const { initialHash, initialNumber, parentHash } =
        await initialize(mockClient)

      expect(next).not.toHaveBeenCalled()

      await setReady(mockClient, initialHash)

      expect(next).toHaveBeenCalledOnce()
      expect(next).toHaveBeenLastCalledWith({
        hash: initialHash,
        number: initialNumber,
        parent: parentHash,
        hasNewRuntime: false,
      } satisfies BlockInfo)
      expect(error).not.toHaveBeenCalled()
      expect(complete).not.toHaveBeenCalled()
    })

    it("emits the new finalized block after finalized", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const { next, error, complete } = observe(client.chainHead$().finalized$)

      const { initialHash, initialNumber } = await initialize(mockClient)
      await setReady(mockClient, initialHash)

      const newBlock = sendNewBlock(mockClient, {
        blockHash: newHash(),
        parentBlockHash: initialHash,
      })

      sendBestBlockChanged(mockClient, {
        bestBlockHash: newBlock.blockHash,
      })
      sendFinalized(mockClient, {
        finalizedBlockHashes: [newBlock.blockHash],
      })

      expect(next).toHaveBeenCalledTimes(2)
      expect(next).toHaveBeenLastCalledWith({
        hash: newBlock.blockHash,
        number: initialNumber + 1,
        parent: newBlock.parentBlockHash,
        hasNewRuntime: false,
      } satisfies BlockInfo)
      expect(error).not.toHaveBeenCalled()
      expect(complete).not.toHaveBeenCalled()
    })

    it("emits the latest finalized block even when there were no subscribers previously", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash, initialNumber } = await initialize(mockClient)

      const newBlock = sendNewBlock(mockClient, {
        blockHash: newHash(),
        parentBlockHash: initialHash,
      })

      sendBestBlockChanged(mockClient, {
        bestBlockHash: newBlock.blockHash,
      })
      sendFinalized(mockClient, {
        finalizedBlockHashes: [newBlock.blockHash],
      })

      const { next, error, complete } = observe(chainHead.finalized$)

      expect(next).toHaveBeenCalledOnce()
      expect(next).toHaveBeenLastCalledWith({
        hash: newBlock.blockHash,
        number: initialNumber + 1,
        parent: newBlock.parentBlockHash,
        hasNewRuntime: false,
      } satisfies BlockInfo)
      expect(error).not.toHaveBeenCalled()
      expect(complete).not.toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })
  })

  describe("unpinning logic", () => {
    it("automatically unpins unused blocks after the last finalized block", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)

      const firstChain = sendNewBlockBranch(mockClient, initialHash, 2)
      const followingChain = sendNewBlockBranch(
        mockClient,
        firstChain.at(-1)!.blockHash,
        2,
      )

      await setReady(mockClient, followingChain.at(-1)!.blockHash, initialHash)

      expect(mockClient.chainHead.mock.unpin).not.toHaveBeenCalled()

      sendBestBlockChanged(mockClient, {
        bestBlockHash: firstChain.at(-1)?.blockHash,
      })
      sendFinalized(mockClient, {
        finalizedBlockHashes: firstChain.map((v) => v.blockHash),
      })
      await wait(0)

      const expected = [
        initialHash,
        ...firstChain.slice(0, -1).map((v) => v.blockHash),
      ]
      expect(mockClient.chainHead.mock.unpinnedHashes).toEqual(
        new Set(expected),
      )

      sendFinalized(mockClient, {
        finalizedBlockHashes: followingChain.map((v) => v.blockHash),
      })
      await wait(0)

      expect(mockClient.chainHead.mock.unpinnedHashes).toEqual(
        new Set([
          ...expected,
          firstChain.slice(-1)[0].blockHash,
          ...followingChain.slice(0, -1).map((v) => v.blockHash),
        ]),
      )

      cleanup(chainHead.unfollow)
    })

    it("unpins pruned branches as soon as refcount reaches 0", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      await setReady(mockClient, initialHash)
      await wait(0)

      const bestChain = sendNewBlockBranch(mockClient, initialHash, 5)
      const deadChain = sendNewBlockBranch(
        mockClient,
        bestChain[2].blockHash,
        10,
      )
      sendBestBlockChanged(mockClient, {
        bestBlockHash: bestChain.at(-1)!.blockHash,
      })

      expect(mockClient.chainHead.mock.unpinnedHashes).toEqual(new Set())

      const usedHash = deadChain.at(-3)!.blockHash
      const bodySub = chainHead.body$(usedHash).subscribe()

      sendFinalized(mockClient, {
        finalizedBlockHashes: bestChain.map((v) => v.blockHash),
        prunedBlockHashes: deadChain.map((v) => v.blockHash),
      })

      await wait(0)
      expect(mockClient.chainHead.mock.unpinnedHashes).toEqual(
        new Set([
          ...deadChain.map((v) => v.blockHash).filter((v) => v != usedHash),
          initialHash,
          ...bestChain.slice(0, -1).map((v) => v.blockHash),
        ]),
      )

      bodySub.unsubscribe()
      await wait(100)
      expect(mockClient.chainHead.mock.unpinnedHashes).toEqual(
        new Set([
          ...deadChain.map((v) => v.blockHash),
          initialHash,
          ...bestChain.slice(0, -1).map((v) => v.blockHash),
        ]),
      )

      cleanup(chainHead.unfollow)
    })
  })

  describe("operation limit recovery", () => {
    it("retries an operation when hit with a limitReached", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      await setReady(mockClient, initialHash)

      const callObserver = observe(chainHead.call$(initialHash, "myFn", ""))
      const bodyObserver = observe(chainHead.body$(initialHash))

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(1)
      expect(mockClient.chainHead.mock.call).toHaveBeenLastCalledWith(
        initialHash,
        "myFn",
        "",
        expect.objectContaining({}),
      )
      await mockClient.chainHead.mock.call.reply(
        initialHash,
        Promise.reject(new OperationLimitError()),
      )

      expect(callObserver.next).not.toHaveBeenCalled()
      expect(callObserver.error).not.toHaveBeenCalled()
      expect(callObserver.complete).not.toHaveBeenCalled()
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(1)

      expect(bodyObserver.next).not.toHaveBeenCalled()
      await mockClient.chainHead.mock.body.reply(initialHash, [])
      expect(bodyObserver.next).toHaveBeenCalledWith([])

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(2)

      await mockClient.chainHead.mock.call.reply(initialHash, "")

      expect(callObserver.next).toHaveBeenCalledWith("")
      expect(callObserver.error).not.toHaveBeenCalled()
      expect(callObserver.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("retries queued operations one by one", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      const newBlocks = sendNewBlockBranch(mockClient, initialHash, 2)
      await setReady(mockClient, newBlocks.at(-1)!.blockHash, initialHash)

      const firstCallObserver = observe(
        chainHead.call$(newBlocks[0].blockHash, "firstCall", ""),
      )
      const secondCallObserver = observe(
        chainHead.call$(newBlocks[1].blockHash, "secondCall", ""),
      )
      observe(chainHead.body$(initialHash))

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(2)
      await mockClient.chainHead.mock.call.reply(
        newBlocks[0].blockHash,
        Promise.reject(new OperationLimitError()),
      )
      await mockClient.chainHead.mock.call.reply(
        newBlocks[1].blockHash,
        Promise.reject(new OperationLimitError()),
      )

      await mockClient.chainHead.mock.body.reply(initialHash, [])
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(3)
      expect(mockClient.chainHead.mock.call).toHaveBeenLastCalledWith(
        newBlocks[1].blockHash,
        "secondCall",
        "",
        expect.objectContaining({}),
      )
      await mockClient.chainHead.mock.call.reply(
        newBlocks[1].blockHash,
        "secondResponse",
      )
      expect(secondCallObserver.next).toHaveBeenCalledWith("secondResponse")

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(4)
      expect(mockClient.chainHead.mock.call).toHaveBeenLastCalledWith(
        newBlocks[0].blockHash,
        "firstCall",
        "",
        expect.objectContaining({}),
      )
      await mockClient.chainHead.mock.call.reply(
        newBlocks[0].blockHash,
        "firstResponse",
      )
      expect(firstCallObserver.next).toHaveBeenCalledWith("firstResponse")

      cleanup(chainHead.unfollow)
    })

    it("waits for the queue to be empty before sending a new request", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      const newBlocks = sendNewBlockBranch(mockClient, initialHash, 2)
      await setReady(mockClient, newBlocks.at(-1)!.blockHash, initialHash)

      observe(chainHead.body$(initialHash))
      observe(chainHead.call$(newBlocks[0].blockHash, "firstCall", ""))

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(1)
      await mockClient.chainHead.mock.call.reply(
        newBlocks[0].blockHash,
        Promise.reject(new OperationLimitError()),
      )

      const callObserver = observe(
        chainHead.call$(newBlocks[1].blockHash, "secondCall", ""),
      )

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(1)

      await mockClient.chainHead.mock.body.reply(initialHash, [])

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(2)

      await mockClient.chainHead.mock.call.reply(
        newBlocks[0].blockHash,
        "firstResponse",
      )

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(3)

      await mockClient.chainHead.mock.call.reply(
        newBlocks[1].blockHash,
        "secondResponse",
      )
      expect(callObserver.next).toHaveBeenCalledWith("secondResponse")

      cleanup(chainHead.unfollow)
    })

    it("removes operations from the queue if they are unsubscribed", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      await setReady(mockClient, initialHash)

      const callObserver = observe(chainHead.call$(initialHash, "myFn", ""))
      observe(chainHead.body$(initialHash))

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(1)
      await mockClient.chainHead.mock.call.reply(
        initialHash,
        Promise.reject(new OperationLimitError()),
      )

      callObserver.unsubscribe()

      await mockClient.chainHead.mock.body.reply(initialHash, [])
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(1)

      cleanup(chainHead.unfollow)
    })

    it("also counts errors as available spots", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      await setReady(mockClient, initialHash)

      const callObserver = observe(chainHead.call$(initialHash, "myFn", ""))
      const bodyObserver = observe(chainHead.body$(initialHash))

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(1)
      await mockClient.chainHead.mock.call.reply(
        initialHash,
        Promise.reject(new OperationLimitError()),
      )

      const error = new Error("boom")
      await mockClient.chainHead.mock.body.reply(
        initialHash,
        Promise.reject(error),
      )
      expect(bodyObserver.error).toHaveBeenCalledWith(error)

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(2)
      await mockClient.chainHead.mock.call.reply(initialHash, "")

      expect(callObserver.next).toHaveBeenCalledWith("")
      expect(callObserver.error).not.toHaveBeenCalled()
      expect(callObserver.complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })
  })

  describe("operations on non-finalized best blocks", () => {
    it("keeps the subscription open if it changes to non-best block while ongoing", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      await setReady(mockClient, initialHash)

      const [forkA] = sendNewBlockBranch(mockClient, initialHash, 1)
      const [forkB] = sendNewBlockBranch(mockClient, initialHash, 1)

      sendBestBlockChanged(mockClient, {
        bestBlockHash: forkA.blockHash,
      })

      const { next, error, complete } = observe(
        chainHead.body$(forkA.blockHash),
      )

      sendBestBlockChanged(mockClient, {
        bestBlockHash: forkB.blockHash,
      })

      const body = ["foo"]
      await mockClient.chainHead.mock.body.reply(forkA.blockHash, body)

      expect(next).toHaveBeenCalledWith(body)
      expect(error).not.toHaveBeenCalled()
      expect(complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("allows starting an operation on a non-best block", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)
      await setReady(mockClient, initialHash)

      const [forkA] = sendNewBlockBranch(mockClient, initialHash, 1)
      const [forkB] = sendNewBlockBranch(mockClient, initialHash, 1)

      sendBestBlockChanged(mockClient, {
        bestBlockHash: forkB.blockHash,
      })

      const { next, error, complete } = observe(
        chainHead.body$(forkA.blockHash),
      )

      const body = ["foo"]
      await mockClient.chainHead.mock.body.reply(forkA.blockHash, body)

      expect(next).toHaveBeenCalledWith(body)
      expect(error).not.toHaveBeenCalled()
      expect(complete).toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })
  })
})

// cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
