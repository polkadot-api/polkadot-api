import { paseo } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { describe, expect, it, vi } from "vitest"
import { getForkliftProvider } from "./lib/forklift"

describe("events", () => {
  describe("watch()", () => {
    it(".watch() reports events after awaiting for the initial block", async () => {
      const [provider, chain] = getForkliftProvider("events")
      const client = createClient(provider)
      const api = client.getTypedApi(paseo)

      await api.getStaticApis()

      const testFn = vi.fn()
      const completeFn = vi.fn()
      const errorFn = vi.fn()
      const subscription = api.event.System.ExtrinsicSuccess.watch().subscribe({
        next: testFn,
        error: errorFn,
        complete: completeFn,
      })

      await chain.newBlock()

      expect(errorFn).not.toHaveBeenCalled()
      expect(completeFn).not.toHaveBeenCalled()
      expect(testFn).toHaveBeenCalled()

      subscription.unsubscribe()
      client.destroy()
    })
  })

  describe("watchBest()", () => {
    it("notifies", () => {})
  })
})
