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
    const {
      fixtures: { getNewMessages },
    } = setupChainHead(withRuntime)

    expect(getNewMessages()).toMatchObject([
      {
        method: "chainHead_unstable_follow",
        params: [withRuntime],
      },
    ])
  })

  it("receives its corresponding subscription messages", () => {
    const {
      fixtures: { sendSubscription, onMsg, onError },
    } = setupChainHeadWithSubscription()

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

    const operationBodyDone = {
      event: "operationBodyDone",
      operationId: "someOperationId",
      value: [""],
    }
    sendSubscription({
      result: operationBodyDone,
    })

    // it should not be received from this listener
    expect(onMsg).toHaveBeenCalledTimes(2)
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

  it("stops receiving messages upon cancelation", () => {
    const {
      unfollow,
      fixtures: { sendMessage, onMsg, onError },
    } = setupChainHead()

    unfollow()

    const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
    sendMessage({
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

    sendMessage({
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
      unfollow,
      fixtures: {
        sendSubscription,
        SUBSCRIPTION_ID,
        getNewMessages,
        onMsg,
        onError,
      },
    } = setupChainHeadWithSubscription()

    unfollow()

    expect(getNewMessages()).toMatchObject([
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
    const {
      unfollow,
      fixtures: { sendSubscription, getNewMessages, onMsg, onError },
    } = setupChainHeadWithSubscription()

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

    unfollow()
    expect(getNewMessages()).toEqual([])
  })

  test("`stop` event triggers a `DisjointError` on all running active operations", () => {
    const {
      body,
      storage,
      call,
      fixtures: { sendSubscription, sendMessage },
    } = setupChainHeadWithSubscription()

    const bodyPromise = body("")
    sendMessage({
      id: 3,
      result: {
        result: "started",
        operationId: "operationBody",
      },
    })

    const storagePromise = storage("", "value", "df", null)
    sendMessage({
      id: 4,
      result: {
        result: "started",
        operationId: "operationStorage",
      },
    })

    const callPromise = call("", "", "")
    sendMessage({
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
    const {
      header,
      unpin,
      body,
      storage,
      call,
      fixtures: { sendSubscription },
    } = setupChainHeadWithSubscription()

    const allPromises = [
      header(""),
      unpin([""]),
      body(""),
      storage("", "value", "df", null),
      call("", "", ""),
    ]
    sendSubscription({
      result: { event: "stop" },
    })

    return Promise.all(
      allPromises.map((p) => expect(p).rejects.toEqual(new DisjointError())),
    )
  })

  it("propagates the JSON-RPC Error when the initial request fails", () => {
    const {
      fixtures: { sendMessage, onMsg, onError },
    } = setupChainHead()

    sendMessage({
      id: 2,
      error: parseError,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new RpcError(parseError))
  })

  it("propagates the JSON-RPC Error on the subscription and cancels the subscription", () => {
    const {
      fixtures: {
        getNewMessages,
        SUBSCRIPTION_ID,
        sendSubscription,
        onMsg,
        onError,
      },
    } = setupChainHeadWithSubscription()

    sendSubscription({
      error: parseError,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new RpcError(parseError))

    expect(getNewMessages()).toMatchObject([
      {
        method: "chainHead_unstable_unfollow",
        params: [SUBSCRIPTION_ID],
      },
    ])
  })
})
