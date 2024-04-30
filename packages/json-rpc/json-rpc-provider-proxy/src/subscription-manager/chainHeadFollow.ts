import { SubscriptionId, SubscriptionLogic } from "@/internal-types"

const [START_METHODS, STOP_METHODS, NOTIFICATION_METHODS] = [
  "follow",
  "unfollow",
  "followEvent",
].map(
  (name) =>
    new Set(
      ["v1", "unstable"].map((version) => `chainHead_${version}_${name}`),
    ),
)
const STOP_EVENT = "stop"

export const chainHeadFollow = (
  onMessage: (msg: string) => void,
): SubscriptionLogic => {
  let notificationMethod = ""
  return {
    onSent(parsed) {
      if (START_METHODS.has(parsed.method)) {
        notificationMethod = parsed.method + "Event"
        return {
          type: "subscribe",
          id: parsed.id,
          onRes: (innerParsed) =>
            innerParsed.id === parsed.id ? { id: innerParsed.result } : null,
        }
      }

      if (STOP_METHODS.has(parsed.method))
        return {
          type: "unsubscribe",
          id: Object.values(parsed.params)[0] as string,
        }

      return null
    },
    onNotification(parsed) {
      if (!NOTIFICATION_METHODS.has(parsed.method)) return null

      return parsed.params.result.event === STOP_EVENT
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
          method: notificationMethod,
          params: {
            subscription: id,
            result: {
              event: STOP_EVENT,
            },
          },
        }),
      )
    },
  }
}
