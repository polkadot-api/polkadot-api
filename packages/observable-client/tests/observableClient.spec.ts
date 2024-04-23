import { BlockInfo, getObservableClient } from "@/index"
import { BlockPrunedError, NotBestBlockError } from "@/chainHead/errors"
import { OperationLimitError } from "@polkadot-api/substrate-client"
import { describe, expect, it } from "vitest"
import {
  createHeader,
  encodeHeader,
  initialize,
  initializeWithMetadata,
  newHash,
  sendBestBlockChanged,
  sendFinalized,
  sendInitialized,
  sendNewBlock,
  sendNewBlockBranch,
  wait,
  waitMicro,
} from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"

describe("observableClient chainHead", () => {
  describe("finalized$", () => {
    it("emits the latest finalized block after initialized", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const { next, error, complete } = observe(client.chainHead$().finalized$)

      const initialized = sendInitialized(mockClient)

      // initialized event is missing some parameters before `finalized$` can emit
      expect(next).not.toHaveBeenCalled()
      expect(mockClient.chainHead.mock.header).toHaveBeenCalledWith(
        initialized.finalizedBlockHashes[0],
      )

      const header = createHeader({
        parentHash: newHash(),
      })
      await mockClient.chainHead.mock.header.reply(
        initialized.finalizedBlockHashes[0],
        encodeHeader(header),
      )

      // finalized does some `.then()` to map values, so you won't get it immediately, but within the same macro task.
      await waitMicro()

      expect(next).toHaveBeenCalledOnce()
      expect(next).toHaveBeenLastCalledWith({
        hash: initialized.finalizedBlockHashes[0],
        number: header.number,
        parent: header.parentHash,
      } satisfies BlockInfo)
      expect(error).not.toHaveBeenCalled()
      expect(complete).not.toHaveBeenCalled()
    })

    it("emits the new finalized block after finalized", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const { next, error, complete } = observe(client.chainHead$().finalized$)

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

      expect(next).toHaveBeenCalledTimes(2)
      expect(next).toHaveBeenLastCalledWith({
        hash: newBlock.blockHash,
        number: initialNumber + 1,
        parent: newBlock.parentBlockHash,
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

      const { initialHash } = await initializeWithMetadata(mockClient)
      await wait(0)

      const firstChain = sendNewBlockBranch(mockClient, initialHash, 3)
      const followingChain = sendNewBlockBranch(
        mockClient,
        firstChain.at(-1)!.blockHash,
        2,
      )

      // Mark all as best block
      sendBestBlockChanged(mockClient, {
        bestBlockHash: followingChain.at(-1)!.blockHash,
      })

      expect(mockClient.chainHead.mock.unpin).not.toHaveBeenCalled()

      sendFinalized(mockClient, {
        finalizedBlockHashes: firstChain.map((v) => v.blockHash),
      })

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

      expect(mockClient.chainHead.mock.unpinnedHashes).toEqual(
        new Set([
          ...expected,
          firstChain.slice(-1)[0].blockHash,
          ...followingChain.slice(0, -1).map((v) => v.blockHash),
        ]),
      )

      cleanup(chainHead.unfollow)
    })

    it("unpins pruned branches", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initializeWithMetadata(mockClient)
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

      sendFinalized(mockClient, {
        finalizedBlockHashes: bestChain.map((v) => v.blockHash),
        prunedBlockHashes: deadChain.map((v) => v.blockHash),
      })

      expect(mockClient.chainHead.mock.unpinnedHashes).toEqual(
        new Set([
          initialHash,
          ...bestChain.slice(0, -1).map((v) => v.blockHash),
          ...deadChain.map((v) => v.blockHash),
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

      const callObserver = observe(chainHead.call$(initialHash, "myFn", ""))
      const bodyObserver = observe(chainHead.body$(initialHash))

      // one internal call made by observable-client to get the metadata of the initial hash
      // so we expect 2 calls
      const initialCalls = 2
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)
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
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)

      expect(bodyObserver.next).not.toHaveBeenCalled()
      await mockClient.chainHead.mock.body.reply(initialHash, [])
      expect(bodyObserver.next).toHaveBeenCalledWith([])

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(
        initialCalls + 1,
      )

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
      sendBestBlockChanged(mockClient, {
        bestBlockHash: newBlocks.at(-1)!.blockHash,
      })

      const firstCallObserver = observe(
        chainHead.call$(newBlocks[0].blockHash, "firstCall", ""),
      )
      const secondCallObserver = observe(
        chainHead.call$(newBlocks[1].blockHash, "secondCall", ""),
      )
      observe(chainHead.body$(initialHash))

      const initialCalls = 3
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)
      await mockClient.chainHead.mock.call.reply(
        newBlocks[0].blockHash,
        Promise.reject(new OperationLimitError()),
      )
      await mockClient.chainHead.mock.call.reply(
        newBlocks[1].blockHash,
        Promise.reject(new OperationLimitError()),
      )

      await mockClient.chainHead.mock.body.reply(initialHash, [])
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(
        initialCalls + 1,
      )
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

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(
        initialCalls + 2,
      )
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
      sendBestBlockChanged(mockClient, {
        bestBlockHash: newBlocks.at(-1)!.blockHash,
      })

      observe(chainHead.body$(initialHash))
      observe(chainHead.call$(newBlocks[0].blockHash, "firstCall", ""))

      const initialCalls = 2
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)
      await mockClient.chainHead.mock.call.reply(
        newBlocks[0].blockHash,
        Promise.reject(new OperationLimitError()),
      )

      const callObserver = observe(
        chainHead.call$(newBlocks[1].blockHash, "secondCall", ""),
      )

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)

      await mockClient.chainHead.mock.body.reply(initialHash, [])

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(
        initialCalls + 1,
      )

      await mockClient.chainHead.mock.call.reply(
        newBlocks[0].blockHash,
        "firstResponse",
      )

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(
        initialCalls + 2,
      )

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

      const callObserver = observe(chainHead.call$(initialHash, "myFn", ""))
      observe(chainHead.body$(initialHash))

      const initialCalls = 2
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)
      await mockClient.chainHead.mock.call.reply(
        initialHash,
        Promise.reject(new OperationLimitError()),
      )

      callObserver.unsubscribe()

      await mockClient.chainHead.mock.body.reply(initialHash, [])
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)

      cleanup(chainHead.unfollow)
    })

    it("also counts errors as available spots", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)

      const callObserver = observe(chainHead.call$(initialHash, "myFn", ""))
      const bodyObserver = observe(chainHead.body$(initialHash))

      const initialCalls = 2
      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(initialCalls)
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

      expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(
        initialCalls + 1,
      )
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

    it("emits an error if the block becomes pruned", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)

      const prunedBranch = sendNewBlockBranch(mockClient, initialHash, 5)
      const forkA = prunedBranch.at(-1)!
      const [forkB] = sendNewBlockBranch(mockClient, initialHash, 1)

      sendBestBlockChanged(mockClient, {
        bestBlockHash: forkA.blockHash,
      })

      const { next, error, complete } = observe(
        chainHead.body$(forkA.blockHash),
      )
      const finalized = observe(chainHead.finalized$)

      // Make sure that when we get the error, finalized has already been called
      error.callback(() => {
        expect(finalized.next).toHaveBeenCalled()
        expect(finalized.next.mock.lastCall![0]).toMatchObject({
          hash: forkB.blockHash,
        })
      })

      sendBestBlockChanged(mockClient, {
        bestBlockHash: forkB.blockHash,
      })
      sendFinalized(mockClient, {
        finalizedBlockHashes: [forkB.blockHash],
        prunedBlockHashes: prunedBranch.map((b) => b.blockHash),
      })

      await mockClient.chainHead.mock.body.reply(forkA.blockHash, ["foo"])

      expect(next).not.toHaveBeenCalledWith()
      expect(error).toHaveBeenCalledWith(new BlockPrunedError())
      expect(complete).not.toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })

    it("prevents starting an operation on a non-best block", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)

      const [forkA] = sendNewBlockBranch(mockClient, initialHash, 1)
      const [forkB] = sendNewBlockBranch(mockClient, initialHash, 1)

      sendBestBlockChanged(mockClient, {
        bestBlockHash: forkA.blockHash,
      })
      sendBestBlockChanged(mockClient, {
        bestBlockHash: forkB.blockHash,
      })

      const { next, error, complete } = observe(
        chainHead.body$(forkA.blockHash),
      )

      expect(next).not.toHaveBeenCalledWith()
      expect(error).toHaveBeenCalledWith(new NotBestBlockError())
      expect(complete).not.toHaveBeenCalled()

      cleanup(chainHead.unfollow)
    })
  })
})

// cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
