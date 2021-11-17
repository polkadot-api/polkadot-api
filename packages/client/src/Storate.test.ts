import { GetProvider, ProviderStatus } from "@unstoppablejs/provider"
import { Storage } from "./Storage"
import { CreateClient } from "./client"
import { Bytes, enhanceCodec } from "@unstoppablejs/scale-codec"
import { from } from "rxjs"

export const AccountId = enhanceCodec(
  Bytes(32),
  (_: string) => new Uint8Array(),
  (value: Uint8Array) =>
    "0x" + [...value].map((val) => val.toString(16).padStart(2, "0")).join(""),
)

const getMockProvider = () => {
  const sent: string[] = []
  let _onMessage: (message: string) => void = () => {}

  const getProvider: GetProvider = (onMessage, onStatusChange) => {
    _onMessage = onMessage
    const send = (message: string): void => {
      sent.push(message)
    }
    const open = () => {
      onStatusChange(ProviderStatus.ready)
    }
    const close = () => {
      sent.splice(0)
    }

    return { send, open, close }
  }
  return { getProvider, sent, onMessage: () => _onMessage }
}

describe("Storage", () => {
  it("observable", () => {
    const { getProvider, sent, onMessage } = getMockProvider()
    const client = CreateClient(getProvider)
    client.connect()

    expect(sent.length).toBe(0)

    const sudo = Storage("Sudo", client)
    const sudoKey = sudo("Key", AccountId)

    const sudoKey$ = from(sudoKey.observable())

    expect(sent.length).toBe(0)

    const valueFn = jest.fn()
    const errFn = jest.fn()

    sudoKey$.subscribe({ next: valueFn, error: errFn })

    expect(sent.length).toBe(1)
    expect(JSON.parse(sent[0])).toEqual({
      id: 1,
      jsonrpc: "2.0",
      method: "state_subscribeStorage",
      params: [
        ["0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b"],
      ],
    })

    expect(valueFn).not.toHaveBeenCalled()

    const subscriptionId = "subscription1"
    onMessage()(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "state_storage",
        params: {
          result: {
            block: "",
            changes: [
              [
                "0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b",
                "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
              ],
            ],
          },
          subscription: subscriptionId,
        },
      }),
    )

    onMessage()(
      JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        result: subscriptionId,
      }),
    )

    expect(errFn).not.toHaveBeenCalled()

    expect(valueFn).toHaveBeenCalledWith(
      "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
    )

    expect(sent.length).toBe(1)

    // Receiving wrong data
    onMessage()(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "state_storage",
        params: {
          result: {
            block: "",
            changes: [
              [
                "0x5c0d1176a568c1f92944340dbfed9e9c530ebca703c85910e7164cb7d1c9e47b",
                "0xd433",
              ],
            ],
          },
          subscription: subscriptionId,
        },
      }),
    )

    expect(errFn).toHaveBeenCalledWith(
      new RangeError("Invalid typed array length: 32"),
    )

    // Since we converted the InteropObservable to an RxJS Observable,
    // the Error should trigger the unsubscription
    expect(sent.length).toBe(2)
    expect(JSON.parse(sent[1])).toEqual({
      id: 2,
      jsonrpc: "2.0",
      method: "state_unsubscribeStorage",
      params: [subscriptionId],
    })
  })
})
