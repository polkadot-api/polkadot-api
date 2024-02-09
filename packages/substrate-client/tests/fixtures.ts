import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import {
  FollowEventWithRuntime,
  FollowEventWithoutRuntime,
  FollowResponse,
  IRpcError,
  createClient,
} from "@/."
import * as vitest from "vitest"

const vi = vitest.vi

export const parseError: IRpcError = {
  code: -32700,
  message: "Parse error",
}

type SpyWithNew<T extends any[]> = vitest.Mock<T> & {
  getNewCalls: () => T[]
}
function createSpy<T extends any[]>(): SpyWithNew<T> {
  const spy = vi.fn<T, void>()

  let latestIdx = 0
  const getNewCalls = () => {
    const result = spy.mock.calls.slice(latestIdx)
    latestIdx = spy.mock.calls.length
    return result
  }

  return Object.assign(spy, { getNewCalls })
}

export interface MockProvider extends ConnectProvider {
  sendMessage: (msg: Record<string, any>) => void
  getNewMessages: <T = Record<string, any>>() => T[]
  getAllMessages: <T = Record<string, any>>() => T[]
}
export const createMockProvider = (): MockProvider => {
  let onMessage: (msg: string) => void
  const sendMessage = (msg: Record<string, any>) => {
    onMessage(JSON.stringify({ ...msg, jsonrpc: "2.0" }))
  }

  const onMessageReceived = createSpy<[message: string]>()

  const provider: ConnectProvider = (_onMessage) => {
    onMessage = _onMessage
    return {
      send: onMessageReceived,
      disconnect() {},
    }
  }

  const getNewMessages = () =>
    onMessageReceived.getNewCalls().map(([m]) => JSON.parse(m))
  const getAllMessages = () =>
    onMessageReceived.mock.calls.map(([m]) => JSON.parse(m))

  return Object.assign(provider, {
    sendMessage,
    getNewMessages,
    getAllMessages,
  })
}

export const createTestClient = () => {
  const provider = createMockProvider()
  const client = createClient(provider)
  // Clear out initial rpc_methods call, as it's internal
  provider.getNewMessages()

  return {
    client,
    provider,
  }
}

export function setupChainHead<T extends boolean = true>(
  withRuntime: T = true as T,
) {
  const onMsg = createSpy()
  const onError = createSpy()
  const { client, provider } = createTestClient()

  const chainHead = client.chainHead(withRuntime, onMsg, onError)

  return {
    chainHead,
    provider,
    onMsg: onMsg as SpyWithNew<
      [T extends true ? FollowEventWithRuntime : FollowEventWithoutRuntime]
    >,
    onError,
  }
}

export function setupChainHeadWithSubscription(withRuntime = true) {
  const { provider, ...rest } = setupChainHead(withRuntime)
  provider.getNewMessages()

  const SUBSCRIPTION_ID = "SUBSCRIPTION_ID"
  provider.sendMessage({
    id: 2,
    result: SUBSCRIPTION_ID,
  })

  const sendSubscription = (
    msg: { result: any } | { error: IRpcError },
  ): void => {
    provider.sendMessage({
      method: "chainHead_unstable_followEvent",
      params: {
        subscription: SUBSCRIPTION_ID,
        ...msg,
      },
    })
  }

  return {
    ...rest,
    provider,
    sendSubscription,
    SUBSCRIPTION_ID,
  }
}

export function setupChainHeadOperation<
  Name extends "body" | "call" | "storage",
>(name: Name, ...args: Parameters<FollowResponse[Name]>) {
  const { provider, chainHead, ...rest } = setupChainHeadWithSubscription()
  provider.getNewMessages()

  const operationPromise = (chainHead[name] as any)(
    ...(args as any[]),
  ) as ReturnType<FollowResponse[Name]>

  return { ...rest, provider, chainHead, operationPromise }
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
  const { provider, sendSubscription, ...rest } = setupChainHeadOperation(
    name,
    ...args,
  )
  provider.getNewMessages()

  const OPERATION_ID = `${nextOperationId++}`
  provider.sendMessage({
    id: 3,
    method: "chainHead_unstable_followEvent",
    result: {
      result: "started",
      operationId: OPERATION_ID,
      ...extras,
    },
  })

  const sendOperationNotification = (msg: {}): void => {
    sendSubscription({
      result: {
        operationId: OPERATION_ID,
        ...msg,
      },
    })
  }

  return {
    ...rest,
    provider,
    sendSubscription,
    sendOperationNotification,
    OPERATION_ID,
  }
}
