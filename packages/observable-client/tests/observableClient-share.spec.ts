import { BlockInfo, getObservableClient } from "@/index"
import { describe, expect, it } from "vitest"
import {
  createHeader,
  encodeHeader,
  newHash,
  sendInitialized,
  wait,
  waitMicro,
} from "./fixtures"
import { createMockSubstrateClient } from "./mockSubstrateClient"
import { observe } from "./observe"

describe("observableClient share", () => {
  it("shares the same instance for the same substrate client", async () => {
    const mockClient = createMockSubstrateClient()
    const client1 = getObservableClient(mockClient)
    const client2 = getObservableClient(mockClient)
    expect(client1).toBe(client2)
    const client3 = getObservableClient(createMockSubstrateClient())
    expect(client2).not.toBe(client3)
  })

  it("shares the same follow subscription with multiple subscribers", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)

    const chainHead1 = client.chainHead$(2)
    const observer1 = observe(chainHead1.finalized$)
    expect(mockClient.chainHead.spy).not.toHaveBeenCalled()

    const chainHead2 = client.chainHead$()
    const observer2 = observe(chainHead2.finalized$)
    expect(mockClient.chainHead.spy).toHaveBeenCalled()

    const initialized = sendInitialized(mockClient)

    // initialized event is missing some parameters before `finalized$` can emit
    const header = createHeader({
      parentHash: newHash(),
    })
    await mockClient.chainHead.mock.header.reply(
      initialized.finalizedBlockHashes[0],
      encodeHeader(header),
    )

    // finalized does some `.then()` to map values, so you won't get it immediately, but within the same macro task.
    await waitMicro()

    expect(observer1.next).toHaveBeenCalledOnce()
    expect(observer1.next).toHaveBeenLastCalledWith({
      hash: initialized.finalizedBlockHashes[0],
      number: header.number,
      parent: header.parentHash,
    } satisfies BlockInfo)

    expect(observer2.next).toHaveBeenCalledOnce()
    expect(observer2.next).toHaveBeenLastCalledWith({
      hash: initialized.finalizedBlockHashes[0],
      number: header.number,
      parent: header.parentHash,
    } satisfies BlockInfo)

    cleanup(chainHead1.unfollow)
    cleanup(chainHead2.unfollow)
  })

  it("handles when a subscriber leaves before fully starting", async () => {
    const mockClient = createMockSubstrateClient()
    const client = getObservableClient(mockClient)

    const chainHead1 = client.chainHead$(2)
    const observer1 = observe(chainHead1.finalized$)
    await wait()
    observer1.unsubscribe()
    chainHead1.unfollow()

    const chainHead2 = client.chainHead$()
    const observer2 = observe(chainHead2.finalized$)
    expect(mockClient.chainHead.spy).toHaveBeenCalled()

    const initialized = sendInitialized(mockClient)

    // initialized event is missing some parameters before `finalized$` can emit
    const header = createHeader({
      parentHash: newHash(),
    })
    await mockClient.chainHead.mock.header.reply(
      initialized.finalizedBlockHashes[0],
      encodeHeader(header),
    )

    // finalized does some `.then()` to map values, so you won't get it immediately, but within the same macro task.
    await waitMicro()

    expect(observer1.next).not.toHaveBeenCalled()
    expect(observer2.next).toHaveBeenCalledOnce()
    expect(observer2.next).toHaveBeenLastCalledWith({
      hash: initialized.finalizedBlockHashes[0],
      number: header.number,
      parent: header.parentHash,
    } satisfies BlockInfo)

    cleanup(chainHead1.unfollow)
    cleanup(chainHead2.unfollow)
  })

  it("handles re-subscriptions", async () => {
    const mockClient = createMockSubstrateClient()

    for (let i = 0; i < 2; i++) {
      mockClient.chainHead.spy.mockRestore()
      const client = getObservableClient(mockClient)

      const chainHead1 = client.chainHead$(2)
      const observer1 = observe(chainHead1.finalized$)
      expect(mockClient.chainHead.spy).not.toHaveBeenCalled()

      const chainHead2 = client.chainHead$()
      const observer2 = observe(chainHead2.finalized$)
      expect(mockClient.chainHead.spy).toHaveBeenCalled()

      const initialized = sendInitialized(mockClient)

      // initialized event is missing some parameters before `finalized$` can emit
      const header = createHeader({
        parentHash: newHash(),
      })
      await mockClient.chainHead.mock.header.reply(
        initialized.finalizedBlockHashes[0],
        encodeHeader(header),
      )

      // finalized does some `.then()` to map values, so you won't get it immediately, but within the same macro task.
      await waitMicro()

      expect(observer1.next).toHaveBeenCalledOnce()
      expect(observer1.next).toHaveBeenLastCalledWith({
        hash: initialized.finalizedBlockHashes[0],
        number: header.number,
        parent: header.parentHash,
      } satisfies BlockInfo)

      expect(observer2.next).toHaveBeenCalledOnce()
      expect(observer2.next).toHaveBeenLastCalledWith({
        hash: initialized.finalizedBlockHashes[0],
        number: header.number,
        parent: header.parentHash,
      } satisfies BlockInfo)

      observer1.unsubscribe()
      observer2.unsubscribe()

      await cleanup(chainHead1.unfollow)
      await cleanup(chainHead2.unfollow)
    }
  })
})

// // cleans up the subscription after a macro task. Doing it too quickly might actually create a subscription, as there are delays internally.
const cleanup = async (unfollow: () => void) => {
  await wait()
  unfollow()
}
