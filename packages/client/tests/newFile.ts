import { getObservableClient } from "@/observableClient"
import { describe, expect, it } from "vitest"
import {
  initializeWithMetadata,
  sendBestBlockChanged,
  sendNewBlockBranch,
} from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"
import { StopError } from "@polkadot-api/substrate-client"
import { cleanup } from "./observableClient-stopError.spec"

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

    const body = observe(chainHead.body$(newBlocks[0].blockHash))

    expect(body.next).not.toHaveBeenCalled()
    expect(mockClient.chainHead.mock.body).toHaveBeenCalledOnce()

    mockClient.chainHead.mock.sendError(new StopError())

    expect(body.error).not.toHaveBeenCalled()

    cleanup(chainHead.unfollow)

    await mockClient.chainHead.mock.call.reply(
      result.initialHash,
      await metadataHex,
    )
  })
})
