import { expect, describe, test } from "vitest"
import { ErrorDisjoint, ErrorRpc, ErrorStop, RpcError } from "@/."
import { setupChainHead, setupChainHeadWithSubscription } from "./fixtures"

describe("chainHead", () => {
  test("it sends the correct follow message", () => {
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

  test("it receives its corresponding subscription messages", () => {
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
    expect(onMsg).toHaveBeenCalledWith(initialized)
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
    expect(onMsg).toHaveBeenLastCalledWith(newBlock)
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
    expect(onMsg).toHaveBeenLastCalledWith(bestBlockChanged)
    expect(onError).not.toHaveBeenCalled()
  })

  test("it stops receiving messages upon cancelation", () => {
    const {
      unfollow,
      fixtures: { sendMessage, onMsg, onError },
    } = setupChainHead()

    unfollow()

    const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
    sendMessage({
      id: 1,
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

  test("it sends an unsubscription message when necessary", () => {
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

  test("`stop` event triggers an `ErrorStop` error and automatically cancels the subscription", () => {
    const {
      unfollow,
      fixtures: { sendSubscription, getNewMessages, onMsg, onError },
    } = setupChainHeadWithSubscription()

    sendSubscription({
      result: { event: "stop" },
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new ErrorStop())

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

  test("`stop` event triggers an `ErrorDisjoint` on all running active operations", () => {
    const {
      body,
      storage,
      call,
      fixtures: { sendSubscription, sendMessage },
    } = setupChainHeadWithSubscription()

    const bodyPromise = body("")
    sendMessage({
      id: 2,
      result: {
        result: "started",
        operationId: "operationBody",
      },
    })

    const storagePromise = storage("", { value: ["df"] }, null)
    sendMessage({
      id: 3,
      result: {
        result: "started",
        operationId: "operationStorage",
      },
    })

    const callPromise = call("", "", "")
    sendMessage({
      id: 4,
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
        expect(p).rejects.toEqual(new ErrorDisjoint()),
      ),
    )
  })

  test("`stop` event triggers an `ErrorDisjoint` on all running pending operations", () => {
    const {
      body,
      storage,
      call,
      fixtures: { sendSubscription, sendMessage },
    } = setupChainHeadWithSubscription()

    const bodyPromise = body("")
    const storagePromise = storage("", { value: ["df"] }, null)
    const callPromise = call("", "", "")

    sendSubscription({
      result: { event: "stop" },
    })

    sendMessage({
      id: 3,
      result: {
        result: "started",
        operationId: "operationStorage",
      },
    })
    sendMessage({
      id: 2,
      result: {
        result: "started",
        operationId: "operationBody",
      },
    })
    sendMessage({
      id: 4,
      result: {
        result: "started",
        operationId: "operationCall",
      },
    })

    return Promise.all(
      [bodyPromise, storagePromise, callPromise].map((p) =>
        expect(p).rejects.toEqual(new ErrorDisjoint()),
      ),
    )
  })

  test("it propagates the JSON-RPC Error when the initial request fails", () => {
    const {
      fixtures: { sendMessage, onMsg, onError },
    } = setupChainHead()

    const error: RpcError = {
      code: -32700,
      message: "Parse error",
    }
    sendMessage({
      id: 1,
      error,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new ErrorRpc(error))
  })

  test("it propagates the JSON-RPC Error on the subscription and cancels the subscription", () => {
    const {
      fixtures: {
        getNewMessages,
        SUBSCRIPTION_ID,
        sendSubscription,
        onMsg,
        onError,
      },
    } = setupChainHeadWithSubscription()

    const error: RpcError = {
      code: -32603,
      message: "Internal error",
    }

    sendSubscription({
      error,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new ErrorRpc(error))

    expect(getNewMessages()).toMatchObject([
      {
        method: "chainHead_unstable_unfollow",
        params: [SUBSCRIPTION_ID],
      },
    ])
  })
})
