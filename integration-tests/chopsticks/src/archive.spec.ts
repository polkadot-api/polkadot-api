import { paseo } from "@polkadot-api/descriptors"
import { createClient, HexString } from "polkadot-api"
import { describe, expect, it } from "vitest"
import { ALICE, getChopsticksProvider } from "./chopsticks"

describe("archive", () => {
  it("loads information from past blocks", async () => {
    const client = createClient(getChopsticksProvider())
    const api = client.getTypedApi(paseo)

    const finalized = await client.getFinalizedBlock()

    const [hash] = await client._request<HexString[], [number]>(
      "archive_v1_hashByHeight",
      [finalized.number - 200],
    )

    const alice = await api.query.System.Account.getValue(ALICE, {
      at: hash,
    })

    expect(alice.data.free).toBeGreaterThan(0n)

    client.destroy()
  })
})
