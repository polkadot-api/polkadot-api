import { paseo } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { describe, expect, it, vi } from "vitest"
import { createBlock, getChopsticksProvider } from "./chopsticks"

describe("events", () => {
  it(".watch() reports events after awaiting for the initial block", async () => {
    const client = createClient(getChopsticksProvider("events"))
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

    await createBlock(client)

    expect(errorFn).not.toHaveBeenCalled()
    expect(completeFn).not.toHaveBeenCalled()
    expect(testFn).toHaveBeenCalled()

    subscription.unsubscribe()
    client.destroy()
  })

  /**
   * Test best-block mode for Event.watch()
   *
   * NOTE: In best-block mode, events may be re-emitted with different values
   * if blockchain reorganizes. This test verifies basic functionality but
   * cannot test reorg scenarios in a single-node test environment.
   * Applications using best-block mode should handle reorg-induced re-emissions.
   */
  it(".watch({ at: 'best' }) reports events from best block", async () => {
    const client = createClient(getChopsticksProvider("events"))
    const api = client.getTypedApi(paseo)

    await api.getStaticApis()

    const testFn = vi.fn()
    const completeFn = vi.fn()
    const errorFn = vi.fn()
    const subscription = api.event.System.ExtrinsicSuccess
      .watch({ at: "best" })
      .subscribe({
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

  it(".watch({ at: 'finalized' }) reports events from finalized block (default)", async () => {
    const client = createClient(getChopsticksProvider("events"))
    const api = client.getTypedApi(paseo)

    await api.getStaticApis()

    const testFn = vi.fn()
    const completeFn = vi.fn()
    const errorFn = vi.fn()
    const subscription = api.event.System.ExtrinsicSuccess
      .watch({ at: "finalized" })
      .subscribe({
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
