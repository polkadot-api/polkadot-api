import { chainHead } from "@/methods"
import type { ParsedJsonRpcEnhancer } from "@/parsed"
import { getRequest, jsonObj, operationNotification } from "@/utils"

const operationPrefix = "__INNER_OP_DesV"
let nextOperationId = 0
export const fixDescendantValues: ParsedJsonRpcEnhancer = (base) => (onMsg) => {
  const [provider, request] = getRequest(base)
  const getDescendantValues = getDescendantValuesFromOldRpc(request)

  // the `id` of the json-rpc request that should respond with the `operationId`
  // if it has started, the value is the callback-function that is waiting for the `operationId`
  const preOpId = new Map<string, (operationId: string) => void>()

  // chainHeadSubscription - operationId => operationState
  const onGoing: Map<
    string,
    Map<
      string,
      {
        isOutterDone: boolean
        isInnerDone: boolean
        cancel: () => void
      }
    >
  > = new Map()

  const { send: originalSend, disconnect } = provider((msg: any) => {
    // it's a response
    if ("id" in msg) {
      const opIdCb = preOpId.get(msg.id)
      if (opIdCb) {
        preOpId.delete(msg.id)
        if (msg.result.result === "started") opIdCb(msg.result.operationId)
      }
    } else if (msg.params) {
      // it's a notifiaction
      const { subscription, result } = (msg as any).params
      const { operationId } = result || {}
      const operations = onGoing.get(subscription)

      if (operations && result.event === "stop") {
        operations.forEach((x) => {
          x.cancel()
        })
        onGoing.delete(subscription)
      }

      const operation = operations?.get(operationId)
      if (operation) {
        switch (result.event) {
          case "operationInaccessible":
          case "operationError":
            operation.cancel()
            break
          case "operationStorageDone": {
            if (operation.isInnerDone) {
              operations!.delete(operationId)
            } else {
              operation.isOutterDone = true
              return
            }
          }
        }
      }
    }
    onMsg(msg)
  })

  const getStartDescendantValues =
    (subscription: string, blockHash: string, keys: string[]) =>
    (operationId: string) => {
      let _cancel = () => {}
      if (!onGoing.has(subscription)) {
        onGoing.set(subscription, new Map())
      }
      const operationsMap = onGoing.get(subscription)!
      const state = {
        isOutterDone: false,
        isInnerDone: false,
        cancel: () => {
          _cancel()
        },
      }
      operationsMap.set(operationId, state)

      let nFinished = 0
      const stoppers = keys.map((key) =>
        getDescendantValues(
          key,
          blockHash,
          (values) => {
            onMsg(
              operationNotification(
                subscription,
                "operationStorageItems",
                operationId,
                { items: values.map(([key, value]) => ({ key, value })) },
              ),
            )
          },
          (error) => {
            _cancel()
            if (!state.isOutterDone) {
              // stop the outer
              originalSend(
                jsonObj({
                  method: "chainHead_v1_stopOperation",
                  params: [operationId],
                }),
              )
            }
            // send error
            onMsg(
              operationNotification(
                subscription,
                "operationError",
                operationId,
                {
                  error:
                    typeof error === "string" ? error : JSON.stringify(error),
                },
              ),
            )
          },
          () => {
            if (++nFinished === keys.length) {
              if (state.isOutterDone) {
                // done
                _cancel()
                onMsg(
                  operationNotification(
                    subscription,
                    "operationStorageDone",
                    operationId,
                  ),
                )
              } else state.isInnerDone = true
            }
          },
        ),
      )
      _cancel = () => {
        operationsMap.delete(operationId)
        stoppers.forEach((cb) => cb())
      }
    }

  const send = (msg: any) => {
    switch (msg.method) {
      case chainHead.storage: {
        const [followSub, blockHash, items] = msg.params as [
          string,
          string,
          any[],
        ]
        const descendantsValuesKeys: string[] = []
        const actualItems = items.filter((x) => {
          const isDescendantsValues = x.type === "descendantsValues"
          if (isDescendantsValues) descendantsValuesKeys.push(x.key)
          return !isDescendantsValues
        })

        const startGetDescendantValues = getStartDescendantValues(
          followSub,
          blockHash,
          descendantsValuesKeys,
        )
        if (!actualItems.length) {
          const operationId = operationPrefix + nextOperationId++
          onMsg(
            jsonObj({
              id: msg.id,
              result: { result: "started", operationId },
            }),
          )
          startGetDescendantValues(operationId)
          onGoing.get(followSub)!.get(operationId)!.isOutterDone = true
          return
        } else if (descendantsValuesKeys.length) {
          preOpId.set(msg.id, startGetDescendantValues)
        }
        msg.params[2] = actualItems
        break
      }
      case chainHead.stopOperation: {
        const [followSubscription, operationId] = msg.params as [string, string]
        const data = onGoing.get(followSubscription)?.get(operationId)
        if (data) {
          data.cancel()
          if (data.isOutterDone) return
        }
        break
      }
      case chainHead.unfollow: {
        const [followSubscription] = msg.params as [string]
        onGoing.get(followSubscription)?.forEach((x) => x.cancel())
        onGoing.delete(followSubscription)
        break
      }
    }
    originalSend(msg)
  }

  return {
    send,
    disconnect,
  }
}

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
const getDescendantValuesFromOldRpc =
  (
    request: <T>(
      method: string,
      args: Array<any>,
      onSuccess: (value: T) => void,
      onError: (e: any) => void,
    ) => void,
  ) =>
  (
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
      request<string[]>(
        "state_getKeysPaged",
        [rootKey, PAGE_SIZE, startAtKey || undefined, at],
        (result) => {
          if (isRunning) {
            if (result.length > 0) {
              onGoingValues++
              request<[{ block: string; changes: Array<[string, string]> }]>(
                "state_queryStorageAt",
                [result, at],
                ([{ changes }]) => {
                  if (isRunning) {
                    onGoingValues--
                    onValues(changes)
                    if (areAllKeysDone && !onGoingValues) onDone()
                  }
                },
                _onError,
              )
            }
            if (result.length < PAGE_SIZE) {
              areAllKeysDone = true
              if (!onGoingValues) onDone()
            } else pullKeys(result.at(-1))
          }
        },
        _onError,
      )
    }
    pullKeys()

    return () => {
      isRunning = false
    }
  }
