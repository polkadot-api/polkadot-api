import { SubscriptionId, SubscriptionLogic } from "@/internal-types"

const START_METHOD = "chainHead_v1_follow"
const STOP_METHOD = "chainHead_v1_unfollow"
const NOTIFICATION_METHOD = "chainHead_v1_followEvent"
const ABORT_EVENT = "stop"

const terminalEvents = new Set([
  ABORT_EVENT,
  "operationInaccessible",
  "operationError",
])

export const chainHeadFollow = (
  onMessage: (msg: string) => void,
): SubscriptionLogic => ({
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
  onAbort: (id) => {
    onMessage(
      JSON.stringify({
        jsonrpc: "2.0",
        method: NOTIFICATION_METHOD,
        params: {
          subscription: id,
          result: {
            event: ABORT_EVENT,
          },
        },
      }),
    )
  },
})
