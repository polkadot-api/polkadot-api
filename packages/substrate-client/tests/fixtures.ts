import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import { FollowResponse, IRpcError, createClient } from "@/."
import * as vitest from "vitest"

const vi = vitest.vi

export const parseError: IRpcError = {
  code: -32700,
  message: "Parse error",
}

export const createTestClient = () => {
  let onMessage: (msg: string) => void
  const sendMessage = (msg: {}) => {
    onMessage(JSON.stringify({ ...msg, jsonrpc: "2.0" }))
  }

  const receivedMessages: Array<string> = []

  const provider: ConnectProvider = (_onMessage) => {
    onMessage = _onMessage
    return {
      send(msg) {
        receivedMessages.push(msg)
      },
      disconnect() {},
    }
  }

  const client = createClient(provider)

  let latestIdx = 0
  const getNewMessages = () => {
    const result = receivedMessages.slice(latestIdx).map((m) => JSON.parse(m))
    latestIdx = receivedMessages.length
    return result
  }

  const getAllMessages = () => receivedMessages.map((m) => JSON.parse(m))

  return {
    client,
    fixtures: {
      sendMessage,
      getNewMessages,
      getAllMessages,
    },
  }
}

export function setupChainHead(withRuntime: boolean = true) {
  const onMsg = vi.fn()
  const onError = vi.fn()
  const { client, fixtures } = createTestClient()
  fixtures.sendMessage({ id: 1, result: [] })
  fixtures.getNewMessages()

  const chainHead = client.chainHead(withRuntime as any, onMsg, onError)

  return { ...chainHead, fixtures: { ...fixtures, onMsg, onError } }
}

export function setupChainHeadWithSubscription(withRuntime = true) {
  const { fixtures, ...rest } = setupChainHead(withRuntime)
  fixtures.getNewMessages()

  const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
  fixtures.sendMessage({
    id: 2,
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
    ...rest,
    fixtures: { ...fixtures, sendSubscription, SUBSCRIPTION_ID },
  }
}

export function setupChainHeadOperation<
  Name extends "body" | "call" | "storage",
>(name: Name, ...args: Parameters<FollowResponse[Name]>) {
  const { fixtures, ...chainhead } = setupChainHeadWithSubscription()
  fixtures.getNewMessages()
  const operationPromise = (chainhead[name] as any)(
    ...(args as any[]),
  ) as ReturnType<FollowResponse[Name]>

  return { ...chainhead, fixtures, operationPromise }
}

let nextOperationId = 1
type ChainHeadOperation =
  | { name: "body" }
  | { name: "call" }
  | { name: "storage"; discardedItems: number }

export function setupChainHeadOperationSubscription<
  Name extends ChainHeadOperation,
>(op: Name, ...args: Parameters<FollowResponse[ChainHeadOperation["name"]]>) {
  const { name, ...extras } = op
  const { fixtures, ...rest } = setupChainHeadOperation(name, ...args)
  fixtures.getNewMessages()

  const OPERATION_ID = `${nextOperationId++}`
  fixtures.sendMessage({
    id: 3,
    result: {
      result: "started",
      operationId: OPERATION_ID,
      ...extras,
    },
  })

  const sendOperationNotification = (msg: {}): void => {
    fixtures.sendSubscription({
      result: {
        operationId: OPERATION_ID,
        ...msg,
      },
    })
  }

  return {
    ...rest,
    fixtures: { ...fixtures, sendOperationNotification, OPERATION_ID },
  }
}
