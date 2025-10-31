import { paseo } from "@polkadot-api/descriptors"
import { CompatibilityLevel, createClient } from "polkadot-api"
import { describe, expect, it } from "vitest"
import { getChopsticksProvider } from "./chopsticks"

describe("compatibility API", () => {
  it("allows checking for non-existing entries", async () => {
    const client = createClient(getChopsticksProvider("compatibility_api"))
    const api = await client.getTypedApi(paseo).getStaticApis()

    // Use case is when you have a union of different `typedApi`, you might want to check which one is compatible with a specific case
    const entry = (api.compat.query.Balances as any).NonExistingThing
    expect(await entry.isCompatible()).toBe(false)
    expect(await entry.isCompatible(CompatibilityLevel.Partial)).toBe(false)

    client.destroy()
  })
})
