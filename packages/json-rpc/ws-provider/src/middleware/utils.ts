import { createParsedClient } from "@polkadot-api/raw-client"
import { noop } from "@polkadot-api/utils"
import { ParsedJsonRpcProvider } from "./types"

export const jsonObj = <T extends {}>(input: T) => ({
  jsonrpc: "2.0",
  ...input,
})

export const operationNotification = <T extends {}>(
  subscription: string,
  event: string,
  operationId: string,
  innerResult: T = {} as T,
) =>
  jsonObj({
    method: "chainHead_v1_followEvent",
    params: {
      subscription,
      result: {
        event,
        operationId,
        ...innerResult,
      },
    },
  })

/**
 * A higher-order function that returns a process to fetch descendant values
 * from the storage of block using an older RPC method.
 *
 * This function takes a `request` function as an argument, which is used to
 * make RPC calls. The returned function accepts a storage key (`rootKey`) and a
 * block hash (`at`) as inputs, as well as three callbacks:
 * 1. `onValues`: triggered when new values are retrieved.
 * 2. `onError`: triggered in case of an error during the operation.
 * 3. `onDone`: triggered when all values have been successfully fetched.
 *
 * The operation works by paginating through storage keys using
 * `state_getKeysPaged`
 * and fetching the corresponding values using `state_queryStorageAt`.
 * It runs in the background and supports stopping the operation early by
 * returning a callback function that, when invoked, cancels further processing.
 *
 * The flow of execution:
 * - The function continuously fetches storage keys in batches.
 * - For each batch, it fetches the descendant values at the specified block
 * hash.
 * - If an error occurs or the user cancels the operation, it stops fetching.
 * - The `onDone` callback is triggered when all the keys have been processed
 * and all ongoing value retrieval operations are completed.
 */
export const createDescendantValues = (
  request: <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
    onSuccess: (value: Payload) => void,
    onError: (e: any) => void,
  ) => () => void,
) => {
  return (
    rootKey: string,
    at: string,
    onValues: (input: Array<[string, string]>) => void,
    onError: (e: any) => void,
    onDone: () => void,
  ): (() => void) => {
    let isRunning = true
    let areAllKeysDone = false
    let onGoingValues = 0

    const _onError = (e: any) => {
      if (isRunning) {
        isRunning = false
        onError(e)
      }
    }

    const PAGE_SIZE = 1000
    const pullKeys = (startAtKey?: string) => {
      request<[string, number, string | undefined, string], string[]>(
        "state_getKeysPaged",
        [rootKey, PAGE_SIZE, startAtKey || undefined, at],
        (result) => {
          if (!isRunning) return
          if (result.length > 0) {
            onGoingValues++
            request<
              [string[], string],
              [{ block: string; changes: Array<[string, string]> }]
            >(
              "state_queryStorageAt",
              [result, at],
              ([{ changes }]) => {
                if (!isRunning) return
                onGoingValues--
                onValues(changes)
                if (areAllKeysDone && !onGoingValues) onDone()
              },
              _onError,
            )
          }
          if (result.length < PAGE_SIZE) {
            areAllKeysDone = true
            if (!onGoingValues) onDone()
          } else pullKeys(result.at(-1))
        },
        _onError,
      )
    }
    pullKeys()

    return () => {
      isRunning = false
    }
  }
}

export const getRequest = (base: ParsedJsonRpcProvider) => {
  let clientSend: (msg: {}) => void = noop
  let clientReceive: (msg: {}) => void = noop

  const cleanup = () => {
    clientSend = noop
    clientReceive = noop
  }

  const { request } = createParsedClient((clientMsg) => {
    clientReceive = clientMsg
    return {
      disconnect: noop,
      send(x) {
        clientSend(x)
      },
    }
  })

  const simpleRequest = <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
    onSuccess: (value: Payload) => void,
    onError: (e: any) => void,
  ): (() => void) => request(method, params, { onSuccess, onError })

  const provider: ParsedJsonRpcProvider = (onMsg, onHalt) => {
    const { send, disconnect } = base(
      (msg) => {
        clientReceive(msg)
        onMsg(msg)
      },
      (e) => {
        cleanup()
        onHalt(e)
      },
    )
    clientSend = send
    return {
      send,
      disconnect() {
        cleanup()
        disconnect()
      },
    }
  }
  return { provider, request, simpleRequest }
}
