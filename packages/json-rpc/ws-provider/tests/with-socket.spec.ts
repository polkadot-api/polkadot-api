import { getWsProvider } from "@/provider"
import { WebSocketClass } from "@/types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

class FakeWebSocket extends EventTarget {
  static instances: FakeWebSocket[] = []
  isClosed = false

  constructor(readonly url: string) {
    super()
    FakeWebSocket.instances.push(this)
  }

  send() {}

  close() {
    this.isClosed = true
  }

  open() {
    this.dispatchEvent(new Event("open"))
  }
}

const openSockets = () => FakeWebSocket.instances.filter((s) => !s.isClosed)

const nextSocket = () => {
  const count = FakeWebSocket.instances.length
  while (FakeWebSocket.instances.length === count) vi.advanceTimersByTime(10)
  return FakeWebSocket.instances.at(-1)!
}

const connect = () =>
  getWsProvider("ws://node", {
    websocketClass: FakeWebSocket as unknown as WebSocketClass,
    timeout: 100,
    heartbeatTimeout: 1_000,
  })(() => {})

describe("withSocket", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    FakeWebSocket.instances = []
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("closes a socket that never opens before the connection timeout", () => {
    const connection = connect()

    for (let i = 0; i < 5; i++) {
      nextSocket()
      vi.advanceTimersByTime(100)
    }

    expect(FakeWebSocket.instances.length).toBeGreaterThan(1)
    expect(openSockets().length).toBeLessThanOrEqual(1)
    connection.disconnect()
  })

  it("closes a socket that goes silent past the heartbeat timeout", () => {
    const connection = connect()

    for (let i = 0; i < 5; i++) {
      nextSocket().open()
      vi.advanceTimersByTime(1_000)
    }

    expect(FakeWebSocket.instances.length).toBeGreaterThan(1)
    expect(openSockets().length).toBeLessThanOrEqual(1)
    connection.disconnect()
  })
})
