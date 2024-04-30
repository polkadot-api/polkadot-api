import { SubscriptionId, SubscriptionLogic } from "@/internal-types"

const versions = ["v1", "unstable"] as const
const groupNames = ["transactionWatch", "transaction"] as const
const groupNameVersionPermutations = versions
  .map((v) => groupNames.map((g) => [v, g] as const))
  .flat()

const [START_METHODS, STOP_METHODS] = ["submitAndWatch", "unwatch"].map(
  (name) =>
    new Set(
      groupNameVersionPermutations.map(
        ([version, groupName]) => `${groupName}_${version}_${name}`,
      ),
    ),
)
const ABORT_EVENT = "dropped"

const terminalEvents = new Set([ABORT_EVENT, "finalized", "error", "invalid"])

export const txSubmitAndWatch = (
  onMessage: (msg: string) => void,
): SubscriptionLogic => {
  let notificationMethod = ""
  return {
    onSent(parsed) {
      if (START_METHODS.has(parsed.method)) {
        if (!notificationMethod) {
          const [groupName, version] = (parsed.method as string).split("_")
          notificationMethod = [groupName, version, "watchEvent"].join("_")
        }
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
      if (notificationMethod !== parsed.method) return null

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
          method: notificationMethod,
          params: {
            subscription: id,
            result: {
              event: ABORT_EVENT,
            },
          },
        }),
      )
    },
  }
}
