import { GetProvider, ProviderStatus } from "@unstoppablejs/provider"
import { Storage } from "./Storage"
import { CreateClient } from "./client"
import {
  Bytes,
  enhanceCodec,
  SDate,
  Str,
  Struct,
  U32,
} from "@unstoppablejs/scale-codec"
import { from } from "rxjs"
import { EncodedArgs, Identity } from "./"

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
  it("observable - no args", () => {
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

  it("observable - args", () => {
    const { getProvider, sent, onMessage } = getMockProvider()
    const client = CreateClient(getProvider)
    client.connect()

    expect(sent.length).toBe(0)

    const CommentCodec = Struct({
      author: AccountId,
      body: Str,
      created: SDate(64),
    })

    const Adz = Storage("Adz", client)
    const commentArgs: EncodedArgs<[adId: number, commentId: number]> = [
      Identity(U32),
      Identity(U32),
    ]

    const comments = Adz("Comments", CommentCodec, ...commentArgs)

    const comment$ = from(comments.observable(38, 1))

    expect(sent.length).toBe(0)

    const valueFn = jest.fn()
    const errFn = jest.fn()

    const subscription = comment$.subscribe({ next: valueFn, error: errFn })

    expect(sent.length).toBe(1)
    expect(JSON.parse(sent[0])).toEqual({
      id: 1,
      jsonrpc: "2.0",
      method: "state_subscribeStorage",
      params: [
        [
          "0x90eff13a51caf0b8e8ca235390273dfe8db8f462c845f795e88963c612ab32002600000001000000",
        ],
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
            block:
              "0x6386d5d0ba8e8935dea5e1393448e8665090fab5c7976c05414a3e7a698216be",
            changes: [
              [
                "0x90eff13a51caf0b8e8ca235390273dfe8db8f462c845f795e88963c612ab32002600000001000000",
                "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d0c776f778693e8a97c010000",
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

    expect(valueFn).toHaveBeenCalledWith({
      author:
        "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
      body: "wow",
      created: new Date("2021-10-22T21:29:24.102Z"),
    })

    expect(sent.length).toBe(1)

    subscription.unsubscribe()

    expect(sent.length).toBe(2)
    expect(JSON.parse(sent[1])).toEqual({
      id: 2,
      jsonrpc: "2.0",
      method: "state_unsubscribeStorage",
      params: [subscriptionId],
    })
  })
})
