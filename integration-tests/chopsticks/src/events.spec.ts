import { paseo } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { describe, expect, it, vi } from "vitest"
import { createBlock, getChopsticksProvider } from "./chopsticks"

describe("events", () => {
  it(".watch() reports events after awaiting for the initial block", async () => {
    const client = createClient(getChopsticksProvider())
    const api = client.getTypedApi(paseo)

    const testFn = vi.fn()
    const completeFn = vi.fn()
    const errorFn = vi.fn()
    const subscription = api.event.System.ExtrinsicSuccess.watch().subscribe({
      next: testFn,
      error: errorFn,
      complete: completeFn,
    })

    await createBlock(client)

    expect(errorFn).not.toHaveBeenCalled()
    expect(completeFn).not.toHaveBeenCalled()
    expect(testFn).toHaveBeenCalled()

    subscription.unsubscribe()
    client.destroy()
  })
})
