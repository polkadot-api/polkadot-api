import type { Middleware } from "../types"
import { chainHead } from "../methods"

const { follow, body, call, storage, unfollow, stopOperation } = chainHead
const terminalOperationEvents = new Set(
  ["BodyDone", "CallDone", "StorageDone", "Inaccessible", "Error"].map(
    (x) => "operation" + x,
  ),
)
const isTerminalNotification = (msg: any): boolean =>
  terminalOperationEvents.has(msg.params?.result?.event)

export const fixUnorderedEvents: Middleware = (base) => (onMsg, onHalt) => {
  const pendingChainHeadSubs = new Set<string>()
  const pendingOperationIds: Map<string, string> = new Map()

  const activeOperationIds = new Map<string, Set<string>>()
  const uknownOperationNotifications = new Map<
    string,
    Map<string, Array<any>>
  >()

  const withClear =
    <Args extends Array<any>>(
      fn: (...args: Args) => void,
    ): ((...args: Args) => void) =>
    (...args) => {
      ;[
        pendingChainHeadSubs,
        pendingOperationIds,
        activeOperationIds,
        uknownOperationNotifications,
      ].forEach((x) => {
        x.clear()
      })
      fn(...args)
    }

  const { send: originalSend, disconnect } = base((message) => {
    // it's a response
    if ("id" in message) {
      onMsg(message)
      const { id, result } = message as unknown as {
        id: string
        result: string
      }
      if (pendingChainHeadSubs.has(id)) {
        pendingChainHeadSubs.delete(id)
        activeOperationIds.set(result, new Set())
        uknownOperationNotifications.set(result, new Map())
        return
      }

      const subId = pendingOperationIds.get(id)
      if (subId !== undefined) {
        pendingOperationIds.delete(id)
        const opId = (message as any).result?.operationId
        // it's possible that the limit has been reached... so we need to check
        // it's also possible that the response came after an unfollow
        if (opId !== undefined && activeOperationIds.has(subId)) {
          const subOperations = activeOperationIds.get(subId)!
          subOperations.add(opId)
          const pendingNotifications = uknownOperationNotifications
            .get(subId)
            ?.get(opId)

          if (pendingNotifications) {
            pendingNotifications.forEach(onMsg)
            uknownOperationNotifications.get(subId)!.delete(opId)
            if (isTerminalNotification(pendingNotifications.at(-1)))
              subOperations.delete(opId)
          }
        }
      }
    } else {
      // it's a notification
      const { subscription, result } = (message as any).params
      const operationIds = activeOperationIds.get(subscription)
      if (operationIds) {
        const { operationId } = (message as any).params.result
        if (operationId !== undefined) {
          if (!operationIds.has(operationId)) {
            // The operationId hasn't arrived yet
            const subscriptionPending =
              uknownOperationNotifications.get(subscription)!
            const pendingMessages = subscriptionPending.get(operationId) ?? []
            pendingMessages.push(message)
            subscriptionPending.set(operationId, pendingMessages)
            return
          } else if (isTerminalNotification(message))
            operationIds.delete(operationId)
        } else if (result?.event === "stop") {
          activeOperationIds.delete(subscription)
          uknownOperationNotifications.delete(subscription)
        }
      }
      onMsg(message)
    }
  }, withClear(onHalt))

  const send = (msg: any) => {
    const subId = msg.params[0]
    switch (msg.method) {
      case follow:
        pendingChainHeadSubs.add(msg.id)
        break

      case body:
      case call:
      case storage:
        pendingOperationIds.set(msg.id, subId)
        break

      case unfollow:
        activeOperationIds.delete(subId)
        uknownOperationNotifications.delete(subId)
        break

      case stopOperation:
        activeOperationIds.get(subId)?.delete(msg.params[1])
    }
    originalSend(msg)
  }

  return {
    send,
    disconnect: withClear(disconnect),
  }
}
