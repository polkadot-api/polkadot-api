import { BlockNotPinnedError, getObservableClient } from "@/index"
import {
  DisjointError,
  StopError,
  StorageItemInput,
} from "@polkadot-api/substrate-client"
import { filter } from "rxjs"
import { describe, expect, it } from "vitest"
import {
  createHeader,
  createNewBlock,
  encodeHeader,
  initialize,
  initializeWithMetadata,
  metadataHex,
  metadataVersions,
  newHash,
  newInitialized,
  sendBestBlockChanged,
  sendNewBlock,
  sendNewBlockBranch,
  wait,
  waitMicro,
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
    await mockClient.chainHead.mock.body.reply(
      requestedBodyHash,
      Promise.reject(new DisjointError()),
    )

    expect(body.error).not.toHaveBeenCalled()

    await initialize(
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

  it("doesn't unpin blocks from the previous session", async () => {
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
    await mockClient.chainHead.mock.body.reply(
      requestedBodyHash,
      Promise.reject(new DisjointError()),
    )

    await initialize(
      mockClient,
      newInitialized({
        finalizedBlockHashes: newBlocks
          .slice(0, 1)
          .map((block) => block.blockHash),
      }),
    )

    // unpinning happened after releasing a refcount, which is done in a macrotask
    await wait()

    expect(mockClient.chainHead.mock.unpin).not.toHaveBeenCalled()

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
    await initialize(
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
    await initialize(
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

    expect(body.error).toHaveBeenCalledWith(
      new BlockNotPinnedError(initialBest, "stop-body"),
    )

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

    expect(body.error).toHaveBeenCalledWith(
      new BlockNotPinnedError(initialBest, "stop-body"),
    )

    cleanup(chainHead.unfollow)
  })

  it("recovers after a stop error happens while fetching the runtime", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initialize(mockClient)
    const runtimeObs = observe(chainHead.runtime$.pipe(filter(Boolean)))
    await mockClient.chainHead.mock.storage.reply(initialHash, "0x000000")
    expect(mockClient.chainHead.mock.call).toHaveBeenCalledOnce()

    expect(runtimeObs.next).not.toHaveBeenCalled()
    expect(runtimeObs.error).not.toHaveBeenCalled()

    mockClient.chainHead.mock.sendError(new StopError())
    await mockClient.chainHead.mock.call.reply(
      initialHash,
      Promise.reject(new DisjointError()),
    )

    expect(runtimeObs.next).not.toHaveBeenCalled()
    expect(runtimeObs.error).not.toHaveBeenCalled()

    await initializeWithMetadata(mockClient)
    expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(3)

    expect(runtimeObs.error).not.toHaveBeenCalled()
    expect(runtimeObs.next).toHaveBeenCalled()

    cleanup(chainHead.unfollow)
  })

  it("recovers after a stop error happens while fetching the runtime and the finalized block changes", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    client.chainHead$()

    const { initialHash } = await initialize(mockClient)
    await mockClient.chainHead.mock.storage.reply(initialHash, "0x000000")
    expect(mockClient.chainHead.mock.call).toHaveBeenCalledOnce()

    const newBlock = sendNewBlock(mockClient, {
      parentBlockHash: initialHash,
    })
    sendBestBlockChanged(mockClient, { bestBlockHash: newBlock.blockHash })

    await mockClient.chainHead.mock.call.reply(initialHash, metadataVersions)

    mockClient.chainHead.mock.sendError(new StopError())

    await initialize(mockClient, {
      finalizedBlockHashes: [newBlock.blockHash],
    })

    sendBestBlockChanged(mockClient, {
      bestBlockHash: newBlock.blockHash,
    })

    await mockClient.chainHead.mock.call.reply(
      newBlock.blockHash,
      await metadataHex,
    )
  })

  it("recovers after a stop error happens while recovering from another stop event", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)
    const newBlock = sendNewBlock(mockClient, {
      parentBlockHash: initialHash,
    })
    sendBestBlockChanged(mockClient, {
      bestBlockHash: newBlock.blockHash,
    })

    const runtimeObs = observe(chainHead.runtime$.pipe(filter(Boolean)))
    const body = observe(chainHead.body$(newBlock.blockHash))

    mockClient.chainHead.mock.sendError(new StopError())
    await waitMicro()
    mockClient.chainHead.mock.sendError(new StopError())

    expect(body.next).not.toHaveBeenCalled()
    expect(body.error).not.toHaveBeenCalled()
    expect(runtimeObs.next).toHaveBeenCalledOnce()
    expect(runtimeObs.error).not.toHaveBeenCalled()

    // initialize without metadata
    // Pass in an extra block as finalized to force a metadata refetch
    const newFinalized = createNewBlock({
      parentBlockHash: newBlock.blockHash,
    })
    await initialize(mockClient, {
      finalizedBlockHashes: [
        initialHash,
        newBlock.blockHash,
        newFinalized.blockHash,
      ],
    })

    await mockClient.chainHead.mock.storage.reply(
      newFinalized.blockHash,
      "0x11000000",
    )
    expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(2)

    // We haven't received a new runtime yet
    expect(runtimeObs.next).toHaveBeenCalledOnce()

    mockClient.chainHead.mock.sendError(new StopError())
    await initializeWithMetadata(mockClient, {
      finalizedBlockHashes: [
        initialHash,
        newBlock.blockHash,
        newFinalized.blockHash,
      ],
    })
    expect(mockClient.chainHead.mock.call).toHaveBeenCalledTimes(2)

    expect(runtimeObs.error).not.toHaveBeenCalled()
    expect(runtimeObs.next).toHaveBeenCalledTimes(1)

    await mockClient.chainHead.mock.body.reply(newBlock.blockHash, ["result"])
    expect(body.error).not.toHaveBeenCalled()
    expect(body.next).toHaveBeenCalledWith(["result"])

    cleanup(chainHead.unfollow)
  })

  it("recovers getHeader requests", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)
    const header = observe(chainHead.header$(initialHash))

    expect(header.next).not.toHaveBeenCalled()
    expect(header.error).not.toHaveBeenCalled()
    expect(mockClient.chainHead.mock.header).toHaveBeenCalledTimes(2)

    mockClient.chainHead.mock.sendError(new StopError())
    await mockClient.chainHead.mock.header.reply(
      initialHash,
      Promise.reject(new DisjointError()),
    )

    expect(header.next).not.toHaveBeenCalled()
    expect(header.error).not.toHaveBeenCalled()
    expect(mockClient.chainHead.mock.header).toHaveBeenCalledTimes(2)

    await initializeWithMetadata(mockClient)

    const headerResponse = createHeader()
    await mockClient.chainHead.mock.header.reply(
      initialHash,
      encodeHeader(headerResponse),
    )
    await waitMicro()

    expect(header.error).not.toHaveBeenCalled()
    expect(header.next).toHaveBeenCalledWith(headerResponse)

    cleanup(chainHead.unfollow)
  })

  it("recovers storage subscriptions", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)
    const queries: StorageItemInput[] = [
      {
        key: "mykey",
        type: "hash",
      },
    ]
    const storage = observe(chainHead.storageQueries$(initialHash, queries))

    mockClient.chainHead.mock.sendError(new StopError())
    mockClient.chainHead.mock.storageSubscription
      .getLastCall(initialHash)
      .sendError(new DisjointError())

    expect(storage.next).not.toHaveBeenCalled()
    expect(storage.error).not.toHaveBeenCalled()

    await initializeWithMetadata(mockClient)

    const responses = queries.map(({ key }) => ({
      key,
      value: `${key} response`,
    }))
    mockClient.chainHead.mock.storageSubscription
      .getLastCall(initialHash)
      .sendDiscarded(0)
      .sendItems(responses)
      .sendComplete()

    responses.forEach((response) =>
      expect(storage.next).toHaveBeenCalledWith(response),
    )

    cleanup(chainHead.unfollow)
  })

  it("handles having a stopError in between a storage subscription response", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)
    const chainHead = client.chainHead$()

    const { initialHash } = await initializeWithMetadata(mockClient)
    const queries: StorageItemInput[] = [
      {
        key: "A",
        type: "hash",
      },
      {
        key: "B",
        type: "hash",
      },
    ]
    const responses = queries.map(({ key }) => ({
      key,
      value: `${key} response`,
    }))
    const storage = observe(chainHead.storageQueries$(initialHash, queries))

    mockClient.chainHead.mock.storageSubscription
      .getLastCall(initialHash)
      .sendDiscarded(0)
      .sendItems([responses[0]])

    mockClient.chainHead.mock.sendError(new StopError())
    mockClient.chainHead.mock.storageSubscription
      .getLastCall(initialHash)
      .sendError(new DisjointError())

    expect(storage.next).toHaveBeenCalledWith(responses[0])
    expect(storage.error).not.toHaveBeenCalled()

    await initializeWithMetadata(mockClient)

    mockClient.chainHead.mock.storageSubscription
      .getLastCall(initialHash)
      .sendDiscarded(0)
      .sendItems(responses)
      .sendComplete()

    responses.forEach((response) =>
      expect(storage.next).toHaveBeenCalledWith(response),
    )

    cleanup(chainHead.unfollow)
  })
})

// cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
