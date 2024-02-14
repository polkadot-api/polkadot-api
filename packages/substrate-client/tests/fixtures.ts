import {
  FollowEventWithRuntime,
  FollowResponse,
  IRpcError,
  createClient,
} from "@/."
import type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
import * as vitest from "vitest"

const vi = vitest.vi

export const parseError: IRpcError = {
  code: -32700,
  message: "Parse error",
}

type SpyWithNew<T extends any[]> = vitest.Mock<T> & {
  getNewCalls: () => T[]
}
function createSpy<T extends any[]>(fn?: (...args: T) => void): SpyWithNew<T> {
  const spy = fn ? vi.fn(fn) : vi.fn<T, void>()

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
  isConnected: () => boolean
}
export const createMockProvider = (): MockProvider => {
  let onMessage: (msg: string) => void
  let isConnected = false

  const sendMessage = (msg: Record<string, any>) => {
    if (!isConnected) {
      // Not covering any test in particular, but this shouldn't really happen on any test.
      throw new Error("Provider can't send messages while disconnected")
    }
    onMessage(JSON.stringify({ ...msg, jsonrpc: "2.0" }))
  }

  const onMessageReceived = createSpy<[message: string]>()
  const provider: ConnectProvider = (_onMessage) => {
    if (isConnected) {
      throw new Error("Mock provider doesn't support multiple connections")
    }
    isConnected = true

    onMessage = _onMessage
    return {
      send: (message) => {
        if (!isConnected) {
          throw new Error(
            "Provider received a message while being disconnected",
          )
        }
        onMessageReceived(message)
      },
      disconnect: () => {
        isConnected = false
      },
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
    isConnected: () => isConnected,
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

export function setupChainHead(
  withRuntime: boolean = true,
  onMsgFn?: (event: FollowEventWithRuntime) => void,
  onErrorFn?: (error: any) => void,
) {
  const onMsg = createSpy(onMsgFn)
  const onError = createSpy(onErrorFn)
  const { client, provider } = createTestClient()

  const chainHead = client.chainHead(withRuntime, onMsg as any, onError)

  return {
    client,
    chainHead,
    provider,
    onMsg,
    onError,
  }
}

export function setupChainHeadWithSubscription(
  withRuntime?: boolean,
  onMsgFn?: (event: FollowEventWithRuntime) => void,
  onErrorFn?: (error: any) => void,
) {
  const { provider, ...rest } = setupChainHead(withRuntime, onMsgFn, onErrorFn)
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
export type ChainHeadOperation =
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
