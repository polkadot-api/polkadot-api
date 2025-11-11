import { getSyncProvider } from "@/get-sync-provider"
import { describe, expect, it } from "vitest"

describe("getSyncProvider", () => {
  it("should not trhow on sync onHalt", async () => {
    let nAttempts = 0
    const provider = getSyncProvider(async () => {
      return (_, onHalt) => {
        nAttempts++
        onHalt()
        return {
          send() {},
          disconnect() {},
        }
      }
    })(() => {})

    await new Promise((res) => setTimeout(res, 0))
    provider.disconnect()

    expect(nAttempts).toBe(1)
  })
})
