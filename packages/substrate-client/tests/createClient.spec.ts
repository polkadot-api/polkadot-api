import { createClient } from "@/index"
import { describe, expect, it } from "vitest"
import { createMockProvider } from "./fixtures"

describe("createClient", () => {
  it("connects immediately to the client when created, and disconnects when destroying it", () => {
    const provider = createMockProvider()
    expect(provider.isConnected()).toBe(false)

    const client = createClient(provider)
    expect(provider.isConnected()).toBe(true)

    client.destroy()
    expect(provider.isConnected()).toBe(false)
  })
})
