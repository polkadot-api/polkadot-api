import { describe, expect, it } from "vitest"
import { ALICE, getChopsticksProvider } from "./chopsticks"
import { createClient } from "polkadot-api"
import { paseo } from "@polkadot-api/descriptors"

describe("storage", () => {
  it("subscribes and decodes storage values", async () => {
    const client = createClient(getChopsticksProvider("storage_sub"))
    const api = client.getTypedApi(paseo)

    const result = await api.query.System.Account.getValue(ALICE)
    const nonce: number = result.nonce
    expect(nonce).toBeGreaterThan(1000)
    client.destroy()
  })

  it("entries decodes storage keys", async () => {
    const client = createClient(getChopsticksProvider("storage_ent"))
    const api = client.getTypedApi(paseo)

    const entries = await api.query.Referenda.ReferendumInfoFor.getEntries()
    expect(entries.length).toBeGreaterThan(0)
    entries.forEach(({ keyArgs }) => expect(keyArgs[0]).toBeTypeOf("number"))

    client.destroy()
  })

  it("returns the raw key if the hasher is opaque", async () => {
    const client = createClient(getChopsticksProvider("storage_raw"))
    const api = client.getTypedApi(paseo)

    const entries =
      await api.query.CoretimeAssignmentProvider.CoreDescriptors.getEntries()
    expect(entries.length).toBeGreaterThan(0)
    const hex: string = entries[0].keyArgs[0]
    expect(hex.startsWith("0x"), "Not a hex string").toBe(true)
    entries.forEach(({ keyArgs }) => expect(keyArgs[0]).toBeTypeOf("string"))

    client.destroy()
  })
})
