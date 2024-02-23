import { DisjointError, RpcError, StopError } from "@/."
import { describe, expect, it, test } from "vitest"
import {
  parseError,
  setupChainHead,
  setupChainHeadWithSubscription,
} from "./fixtures"

const eventToType = (input: { event: string }) => {
  const { event: type, ...rest } = input
  return { type, ...rest }
}

const nilHash =
  "0x0000000000000000000000000000000000000000000000000000000000000000"
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
      finalizedBlockHashes: [nilHash],
      finalizedBlockRuntime: nilHash,
    }
    sendSubscription({
      result: initialized,
    })

    expect(onMsg).toHaveBeenCalledOnce()
    expect(onMsg).toHaveBeenCalledWith(eventToType(initialized))
    expect(onError).not.toHaveBeenCalled()

    const newBlock = {
      event: "newBlock",
      blockHash: nilHash,
      parentBlockHash: nilHash,
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
      bestBlockHash: nilHash,
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
    const { sendSubscription, onMsg, onError, chainHead, provider } =
      setupChainHeadWithSubscription(true, (evt) => {
        if (evt.type === "initialized") {
          chainHead.unfollow()
        }
      })
    provider.getNewMessages()

    sendSubscription({
      result: {
        event: "initialized",
        finalizedBlockHash: nilHash,
        finalizedBlockRuntime: nilHash,
      },
    })
    sendSubscription({
      result: {
        type: "newBlock",
        blockHash: nilHash,
        parentBlockHash: nilHash,
        newRuntime: null,
      },
    })

    expect(provider.getNewMessages()).toMatchObject([
      {
        method: "chainHead_unstable_unfollow",
      },
    ])
    expect(onMsg).toHaveBeenCalledOnce()
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
      finalizedBlockHash: nilHash,
      finalizedBlockRuntime: nilHash,
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
        finalizedBlockHash: nilHash,
        finalizedBlockRuntime: nilHash,
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
    provider.replyLast({
      result: {
        result: "started",
        operationId: "operationBody",
      },
    })

    const storagePromise = chainHead.storage("", "value", "df", null)
    provider.replyLast({
      result: {
        result: "started",
        operationId: "operationStorage",
      },
    })

    const callPromise = chainHead.call("", "", "")
    provider.replyLast({
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

    provider.replyLast({
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

  it("propagates the JSON-RPC Error when an operation can't be initiated without canceling the subscription", async () => {
    const { chainHead, provider, onError } = setupChainHeadWithSubscription()
    let id = 3

    const allOperations = [
      () => chainHead.header(""),
      () => chainHead.unpin([""]),
      () => chainHead.body(""),
      () => chainHead.storage("", "value", "df", null),
      () => chainHead.call("", "", ""),
    ]

    for (const op of allOperations) {
      const promise = op()
      provider.sendMessage({
        id: id++,
        error: parseError,
      })
      await expect(promise).rejects.toEqual(new RpcError(parseError))
    }

    expect(onError).not.toHaveBeenCalled()
  })

  test("destroying the client triggers a `DisjointError` on all pending requests", () => {
    const { client, chainHead, provider } = setupChainHead()
    const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
    provider.replyLast({
      result: SUBSCRIPTION_ID,
    })

    const allPromises = [
      chainHead.header(""),
      chainHead.unpin([""]),
      chainHead.body(""),
      chainHead.storage("", "value", "df", null),
      chainHead.call("", "", ""),
    ]
    client.destroy()

    return Promise.all(
      allPromises.map((p) => expect(p).rejects.toEqual(new DisjointError())),
    )
  })

  test("destroying the client triggers a `DisjointError` on all pending requests before JSON-RPC server confirmed subscription", () => {
    const { client, chainHead } = setupChainHead()

    const allPromises = [
      chainHead.header(""),
      chainHead.unpin([""]),
      chainHead.body(""),
      chainHead.storage("", "value", "df", null),
      chainHead.call("", "", ""),
    ]
    client.destroy()

    return Promise.all(
      allPromises.map((p) => expect(p).rejects.toEqual(new DisjointError())),
    )
  })
})
