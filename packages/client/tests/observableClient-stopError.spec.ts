import { getObservableClient } from "@/observableClient"
import { describe, expect, it } from "vitest"
import {
  createHeader,
  encodeHeader,
  initializeWithMetadata,
  newInitialized,
  sendBestBlockChanged,
  sendInitialized,
  sendNewBlockBranch,
  wait,
  waitMicro,
} from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"
import { StopError } from "@polkadot-api/substrate-client"

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

    sendInitialized(
      mockClient,
      newInitialized({
        finalizedBlockHashes: newBlocks.map((block) => block.blockHash),
      }),
    )
    await mockClient.chainHead.mock.header.reply(
      newBlocks[0].blockHash,
      encodeHeader(
        createHeader({
          parentHash: initialHash,
        }),
      ),
    )
    await waitMicro()

    expect(mockClient.chainHead.mock.body).toHaveBeenCalledTimes(2)

    const bodyResponse = ["foo"]
    await mockClient.chainHead.mock.body.reply(requestedBodyHash, bodyResponse)

    expect(body.next).toHaveBeenCalledWith(bodyResponse)

    cleanup(chainHead.unfollow)
  })
})

// cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
