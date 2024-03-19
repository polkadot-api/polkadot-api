import { BlockNotPinnedError, getObservableClient } from "@/observableClient"
import { StopError } from "@polkadot-api/substrate-client"
import { describe, expect, it } from "vitest"
import {
  initializeWithMetadata,
  newHash,
  newInitialized,
  sendBestBlockChanged,
  sendNewBlockBranch,
  wait,
} from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"

describe("observableClient stopError recovery", () => {
  it("recovers ongoing operations if the blocks become finalized", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)

    const newBlocks = sendNewBlockBranch(mockClient, initialHash, 3)
    sendBestBlockChanged(mockClient, {
      bestBlockHash: newBlocks.at(-1)!.blockHash,
    })

    const requestedBodyHash = newBlocks[0].blockHash
    const body = observe(chainHead.body$(requestedBodyHash))

    expect(body.next).not.toHaveBeenCalled()
    expect(mockClient.chainHead.mock.body).toHaveBeenCalledOnce()

    mockClient.chainHead.mock.sendError(new StopError())

    expect(body.error).not.toHaveBeenCalled()

    await initializeWithMetadata(
      mockClient,
      newInitialized({
        finalizedBlockHashes: newBlocks.map((block) => block.blockHash),
      }),
    )

    expect(mockClient.chainHead.mock.body).toHaveBeenCalledTimes(2)

    const bodyResponse = ["foo"]
    await mockClient.chainHead.mock.body.reply(requestedBodyHash, bodyResponse)

    expect(body.next).toHaveBeenCalledWith(bodyResponse)

    cleanup(chainHead.unfollow)
  })

  it("recovers ongoing operations if it continues existing after recovering", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)

    const newBlocks = sendNewBlockBranch(mockClient, initialHash, 3)
    sendBestBlockChanged(mockClient, {
      bestBlockHash: newBlocks.at(-1)!.blockHash,
    })

    const requestedBodyHash = newBlocks[1].blockHash
    const body = observe(chainHead.body$(requestedBodyHash))

    mockClient.chainHead.mock.sendError(new StopError())
    await initializeWithMetadata(
      mockClient,
      newInitialized({
        finalizedBlockHashes: [newBlocks[0].blockHash],
      }),
    )

    expect(mockClient.chainHead.mock.body).toHaveBeenCalledOnce()

    newBlocks.slice(1).forEach((block) => {
      mockClient.chainHead.mock.send(block)
    })

    // In fact it should restart after we get confirmation that the block is still there
    // Maybe an open question, this depends on the order of the enhancer
    // "withEnsureCanonicalChain" + "withStopRecovery"
    expect(mockClient.chainHead.mock.body).toHaveBeenCalledTimes(2)

    sendBestBlockChanged(mockClient, {
      bestBlockHash: newBlocks.at(-1)!.blockHash,
    })

    const bodyResponse = ["foo"]
    await mockClient.chainHead.mock.body.reply(requestedBodyHash, bodyResponse)

    expect(body.next).toHaveBeenCalledWith(bodyResponse)

    cleanup(chainHead.unfollow)
  })

  it("rejects ongoing operations if the block hasn't recovered after new best block", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)

    const newBlocks = sendNewBlockBranch(mockClient, initialHash, 3)
    const initialBest = newBlocks.at(-1)!.blockHash
    sendBestBlockChanged(mockClient, {
      bestBlockHash: initialBest,
    })

    const body = observe(chainHead.body$(initialBest))

    mockClient.chainHead.mock.sendError(new StopError())
    await initializeWithMetadata(
      mockClient,
      newInitialized({
        finalizedBlockHashes: [newBlocks[0].blockHash],
      }),
    )

    expect(mockClient.chainHead.mock.body).toHaveBeenCalledOnce()

    const lastIsGone = newBlocks.slice(0, -1)
    lastIsGone.forEach((block) => {
      mockClient.chainHead.mock.send(block)
    })

    sendBestBlockChanged(mockClient, {
      bestBlockHash: lastIsGone.at(-1)!.blockHash,
    })

    expect(body.error).toHaveBeenCalledWith(new BlockNotPinnedError())

    cleanup(chainHead.unfollow)
  })

  it("rejects ongoing operations if the finalized blocks don't include any known block", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)

    const newBlocks = sendNewBlockBranch(mockClient, initialHash, 3)
    const initialBest = newBlocks.at(-1)!.blockHash
    sendBestBlockChanged(mockClient, {
      bestBlockHash: initialBest,
    })

    const body = observe(chainHead.body$(initialBest))

    mockClient.chainHead.mock.sendError(new StopError())
    await initializeWithMetadata(mockClient, {
      finalizedBlockHashes: [newHash()],
    })

    expect(body.error).toHaveBeenCalledWith(new BlockNotPinnedError())

    cleanup(chainHead.unfollow)
  })
})

// cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
