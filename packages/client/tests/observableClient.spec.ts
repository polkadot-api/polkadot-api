import { BlockInfo, getObservableClient } from "@/observableClient"
import { describe, expect, it } from "vitest"
import {
  createHeader,
  encodeHeader,
  initialize,
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
        initialized.finalizedBlockHash,
      )

      const header = createHeader({
        parentHash: newHash(),
      })
      await mockClient.chainHead.mock.header.reply(
        initialized.finalizedBlockHash,
        encodeHeader(header),
      )

      // finalized does some `.then()` to map values, so you won't get it immediately, but within the same macro task.
      await waitMicro()

      expect(next).toHaveBeenCalledOnce()
      expect(next).toHaveBeenLastCalledWith({
        hash: initialized.finalizedBlockHash,
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

      const { initialHash } = await initialize(mockClient)

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

      let [unpinned] = await mockClient.chainHead.mock.unpin.waitNextCall()

      let expected = [
        initialHash,
        ...firstChain.slice(0, -1).map((v) => v.blockHash),
      ]
      expect(new Set(unpinned)).toEqual(new Set(expected))

      sendFinalized(mockClient, {
        finalizedBlockHashes: followingChain.map((v) => v.blockHash),
      })

      unpinned = (await mockClient.chainHead.mock.unpin.waitNextCall())[0]
      expected = [
        firstChain.slice(-1)[0].blockHash,
        ...followingChain.slice(0, -1).map((v) => v.blockHash),
      ]
      expect(new Set(unpinned)).toEqual(new Set(expected))

      cleanup(chainHead.unfollow)
    })

    it("unpins pruned branches", async () => {
      const mockClient = createMockSubstrateClient()
      const client = getObservableClient(mockClient)
      const chainHead = client.chainHead$()

      const { initialHash } = await initialize(mockClient)

      const bestChain = sendNewBlockBranch(mockClient, initialHash, 5)
      const deadChain = sendNewBlockBranch(
        mockClient,
        bestChain[2].blockHash,
        10,
      )
      sendBestBlockChanged(mockClient, {
        bestBlockHash: bestChain.at(-1)!.blockHash,
      })

      sendFinalized(mockClient, {
        finalizedBlockHashes: bestChain.map((v) => v.blockHash),
        prunedBlockHashes: deadChain.map((v) => v.blockHash),
      })

      let [unpinned] = await mockClient.chainHead.mock.unpin.waitNextCall()

      let expected = [
        initialHash,
        ...bestChain.slice(0, -1).map((v) => v.blockHash),
        ...deadChain.map((v) => v.blockHash),
      ]
      expect(new Set(unpinned)).toEqual(new Set(expected))

      cleanup(chainHead.unfollow)
    })
  })
})

// cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
