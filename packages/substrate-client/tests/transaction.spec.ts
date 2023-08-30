import { expect, describe, test, vi, it } from "vitest"
import { createTestClient, parseError } from "./fixtures"
import { RpcError, TransactionError, IRpcError } from "@/."

function setupTx(tx: string = "") {
  const onMsg = vi.fn()
  const onError = vi.fn()
  const { client, fixtures } = createTestClient()
  const cancel = client.transaction(tx, onMsg, onError)
  return { cancel, fixtures: { ...fixtures, onMsg, onError } }
}

function setupTxWithSubscription() {
  const { cancel, fixtures } = setupTx()
  fixtures.getNewMessages()

  const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
  fixtures.sendMessage({
    id: 1,
    result: SUBSCRIPTION_ID,
  })

  const sendSubscription = (
    msg: { result: any } | { error: IRpcError },
  ): void => {
    fixtures.sendMessage({
      params: {
        subscription: SUBSCRIPTION_ID,
        ...msg,
      },
    })
  }

  return {
    cancel,
    fixtures: { ...fixtures, sendSubscription, SUBSCRIPTION_ID },
  }
}

describe("transaction", () => {
  it("sends the correct transaction message", () => {
    const FAKE_TX = "FAKE_TX"
    const {
      fixtures: { getNewMessages },
    } = setupTx(FAKE_TX)

    expect(getNewMessages()).toMatchObject([
      {
        method: "transaction_unstable_submitAndWatch",
        params: [FAKE_TX],
      },
    ])
  })

  it("receives its corresponding subscription messages", () => {
    const {
      fixtures: { sendMessage, sendSubscription, onMsg, onError },
    } = setupTxWithSubscription()

    const validated = { event: "validated" }
    sendSubscription({
      result: validated,
    })

    expect(onMsg).toHaveBeenCalledOnce()
    expect(onMsg).toHaveBeenCalledWith(validated)
    expect(onError).not.toHaveBeenCalled()

    const broadcasted = { event: "broadcasted", numPeers: 2 }
    sendSubscription({
      result: broadcasted,
    })

    expect(onMsg).toHaveBeenCalledTimes(2)
    expect(onMsg).toHaveBeenLastCalledWith(broadcasted)
    expect(onError).not.toHaveBeenCalled()

    sendMessage({
      params: {
        subscription: "wrongSubscriptionId",
        result: { event: "broadcasted", numPeers: 5 },
      },
    })

    expect(onMsg).toHaveBeenCalledTimes(2)
    expect(onError).not.toHaveBeenCalled()

    const finalized = {
      event: "finalized",
      block: {
        hash: "someHash",
        index: "1",
      },
    }
    sendSubscription({
      result: finalized,
    })

    expect(onMsg).toHaveBeenCalledTimes(3)
    expect(onMsg).toHaveBeenLastCalledWith(finalized)
    expect(onError).not.toHaveBeenCalled()
  })

  it("stops receiving messages upon cancelation", () => {
    const {
      cancel,
      fixtures: { sendMessage, onMsg, onError },
    } = setupTx()

    cancel()

    const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
    sendMessage({
      id: 1,
      result: SUBSCRIPTION_ID,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()

    sendMessage({
      params: {
        subscription: SUBSCRIPTION_ID,
        result: { event: "validated" },
      },
    })
    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it("sends an unsubscription message when necessary", () => {
    const {
      cancel,
      fixtures: {
        sendSubscription,
        SUBSCRIPTION_ID,
        getNewMessages,
        onMsg,
        onError,
      },
    } = setupTxWithSubscription()

    cancel()

    expect(getNewMessages()).toMatchObject([
      {
        method: "transaction_unstable_unwatch",
        params: [SUBSCRIPTION_ID],
      },
    ])

    sendSubscription({
      result: { event: "validated" },
    })
    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  test.each(["dropped", "invalid", "error"])(
    "`%s` event triggers a `TransactionError` error and automatically cancels the subscription",
    (eventType) => {
      const {
        cancel,
        fixtures: { sendSubscription, getNewMessages, onMsg, onError },
      } = setupTxWithSubscription()

      const error = `${eventType}: something wrong happened`
      sendSubscription({
        result: { event: eventType, error },
      })

      expect(onMsg).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledOnce()
      expect(onError).toHaveBeenCalledWith(
        new TransactionError({ event: eventType as any, error }),
      )

      sendSubscription({
        result: { event: "broadcasted", numPeers: 5 },
      })

      expect(onMsg).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledOnce()

      cancel()
      expect(getNewMessages()).toEqual([])
    },
  )

  test("`finalized` event should automatically cancel the subscription", () => {
    const {
      cancel,
      fixtures: { sendSubscription, getNewMessages, onMsg, onError },
    } = setupTxWithSubscription()

    const finalizedEvent = { event: "finalized" }
    sendSubscription({
      result: finalizedEvent,
    })

    expect(onMsg).toHaveBeenCalledOnce()
    expect(onMsg).toHaveBeenCalledWith(finalizedEvent)
    expect(onError).not.toHaveBeenCalled()

    sendSubscription({
      result: { event: "broadcasted", numPeers: 5 },
    })

    expect(onMsg).toHaveBeenCalledOnce()
    expect(onError).not.toHaveBeenCalled()

    getNewMessages()

    cancel()

    expect(getNewMessages()).toEqual([])
  })

  it("propagates the JSON-RPC Error when the initial request fails", () => {
    const {
      fixtures: { sendMessage, onMsg, onError },
    } = setupTx()

    sendMessage({
      id: 1,
      error: parseError,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new RpcError(parseError))
  })

  it("propagates the JSON-RPC Error on the subscription", () => {
    const {
      fixtures: { sendSubscription, onMsg, onError },
    } = setupTxWithSubscription()

    const error: IRpcError = {
      code: -32603,
      message: "Internal error",
    }

    sendSubscription({
      error,
    })

    expect(onMsg).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledOnce()
    expect(onError).toHaveBeenCalledWith(new RpcError(error))
  })
})
