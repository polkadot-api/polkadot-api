import { expect, describe, test, it } from "vitest"
import { DisjointError, RpcError, StopError } from "@/."
import {
  parseError,
  setupChainHead,
  setupChainHeadWithSubscription,
} from "./fixtures"

const eventToType = (input: { event: string }) => {
  const { event: type, ...rest } = input
  return { type, ...rest }
}

describe("chainHead", () => {
  it("sends the correct follow message", () => {
    const withRuntime = true
    const { provider } = setupChainHead(withRuntime)

    expect(provider.getNewMessages()).toMatchObject([
      {
        method: "chainHead_unstable_follow",
        params: [withRuntime],
      },
    ])
  })

  it("receives its corresponding subscription messages", () => {
    const { sendSubscription, onMsg, onError } =
      setupChainHeadWithSubscription()

    const initialized = {
      event: "initialized",
      finalizedBlockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      finalizedBlockRuntime:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    }

    sendSubscription({
      result: initialized,
    })

    expect(onMsg).toHaveBeenCalledOnce()
    expect(onMsg).toHaveBeenCalledWith(eventToType(initialized))
    expect(onError).not.toHaveBeenCalled()

    const newBlock = {
      event: "newBlock",
      blockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      parentBlockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      newRuntime: "",
    }
    sendSubscription({
      result: newBlock,
    })

    expect(onMsg).toHaveBeenCalledTimes(2)
    expect(onMsg).toHaveBeenCalledWith(eventToType(newBlock))
    expect(onError).not.toHaveBeenCalled()

    const bestBlockChanged = {
      event: "bestBlockChanged",
      bestBlockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    }
    sendSubscription({
      result: bestBlockChanged,
    })

    expect(onMsg).toHaveBeenCalledTimes(3)
    expect(onMsg).toHaveBeenCalledWith(eventToType(bestBlockChanged))
    expect(onError).not.toHaveBeenCalled()
  })

  it("doesn't emit events belonging to an operation", () => {
    const { sendSubscription, onMsg, onError } =
      setupChainHeadWithSubscription()

    sendSubscription({
      result: {
        event: "operationBodyDone",
        operationId: "someOperationId",
        value: [""],
      },
    })
    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it("stops receiving messages upon cancelation", () => {
    const { chainHead, provider, onMsg, onError } = setupChainHead()

    chainHead.unfollow()

    const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
    provider.sendMessage({
      id: 2,
      result: SUBSCRIPTION_ID,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()

    const initialized = {
      event: "initialized",
      finalizedBlockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      finalizedBlockRuntime:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    }

    provider.sendMessage({
      params: {
        subscription: SUBSCRIPTION_ID,
        result: initialized,
      },
    })
    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it("sends an unsubscription message when necessary", () => {
    const {
      chainHead,
      provider,
      sendSubscription,
      SUBSCRIPTION_ID,
      onMsg,
      onError,
    } = setupChainHeadWithSubscription()

    chainHead.unfollow()

    expect(provider.getNewMessages()).toMatchObject([
      {
        method: "chainHead_unstable_unfollow",
        params: [SUBSCRIPTION_ID],
      },
    ])

    const initialized = {
      event: "initialized",
      finalizedBlockHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      finalizedBlockRuntime:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    }
    sendSubscription({
      result: initialized,
    })
    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  test("`stop` event triggers an `StopError` and automatically cancels the subscription", () => {
    const { chainHead, provider, sendSubscription, onMsg, onError } =
      setupChainHeadWithSubscription()

    sendSubscription({
      result: { event: "stop" },
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new StopError())

    sendSubscription({
      result: {
        event: "initialized",
        finalizedBlockHash:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        finalizedBlockRuntime:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
      },
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()

    chainHead.unfollow()
    expect(provider.getNewMessages()).toEqual([])
  })

  test("`stop` event triggers a `DisjointError` on all running active operations", () => {
    const { chainHead, sendSubscription, provider } =
      setupChainHeadWithSubscription()

    const bodyPromise = chainHead.body("")
    provider.sendMessage({
      id: 3,
      result: {
        result: "started",
        operationId: "operationBody",
      },
    })

    const storagePromise = chainHead.storage("", "value", "df", null)
    provider.sendMessage({
      id: 4,
      result: {
        result: "started",
        operationId: "operationStorage",
      },
    })

    const callPromise = chainHead.call("", "", "")
    provider.sendMessage({
      id: 5,
      result: {
        result: "started",
        operationId: "operationCall",
      },
    })

    sendSubscription({
      result: { event: "stop" },
    })

    return Promise.all(
      [bodyPromise, storagePromise, callPromise].map((p) =>
        expect(p).rejects.toEqual(new DisjointError()),
      ),
    )
  })

  test("`stop` event triggers a `DisjointError` on all pending requests", () => {
    const { chainHead, sendSubscription } = setupChainHeadWithSubscription()

    const allPromises = [
      chainHead.header(""),
      chainHead.unpin([""]),
      chainHead.body(""),
      chainHead.storage("", "value", "df", null),
      chainHead.call("", "", ""),
    ]
    sendSubscription({
      result: { event: "stop" },
    })

    return Promise.all(
      allPromises.map((p) => expect(p).rejects.toEqual(new DisjointError())),
    )
  })

  it("propagates the JSON-RPC Error when the initial request fails", () => {
    const { provider, onMsg, onError } = setupChainHead()

    provider.sendMessage({
      id: 2,
      error: parseError,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new RpcError(parseError))
  })

  it("propagates the JSON-RPC Error on the subscription and cancels the subscription", () => {
    const { provider, SUBSCRIPTION_ID, sendSubscription, onMsg, onError } =
      setupChainHeadWithSubscription()

    sendSubscription({
      error: parseError,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new RpcError(parseError))

    expect(provider.getNewMessages()).toMatchObject([
      {
        method: "chainHead_unstable_unfollow",
        params: [SUBSCRIPTION_ID],
      },
    ])
  })
})
