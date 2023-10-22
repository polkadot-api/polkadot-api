import { SubscriptionId, SubscriptionLogic } from "@/internal-types"

const START_METHOD = "transaction_unstable_submitAndWatch"
const STOP_METHOD = "transaction_unstable_unwatch"
const NOTIFICATION_METHOD = "transaction_unstable_watchEvent"
const ABORT_EVENT = "dropped"

const terminalEvents = new Set([ABORT_EVENT, "finalized", "error", "invalid"])

export const txSubmitAndWatch: SubscriptionLogic = {
  onSent(parsed) {
    if (parsed.method === START_METHOD)
      return {
        type: "subscribe",
        id: parsed.id,
        onRes: (innerParsed) =>
          innerParsed.id === parsed.id ? { id: innerParsed.result } : null,
      }

    if (parsed.method === STOP_METHOD)
      return {
        type: "unsubscribe",
        id: Object.values(parsed.params)[0] as string,
      }

    return null
  },
  onNotification(parsed) {
    if (parsed.method !== NOTIFICATION_METHOD) return null

    return terminalEvents.has(parsed.params.result.event)
      ? {
          type: "end",
          id: parsed.params.subscription as SubscriptionId,
        }
      : null
  },
  onAbort: (id) => ({
    jsonrpc: "2.0",
    method: NOTIFICATION_METHOD,
    params: {
      subscription: id,
      result: {
        event: ABORT_EVENT,
      },
    },
  }),
}
