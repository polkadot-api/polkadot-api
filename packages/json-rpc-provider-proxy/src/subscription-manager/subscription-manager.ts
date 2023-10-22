import type {
  RequestId,
  SubscriptionId,
  SubscriptionLogic,
  JsonMessage,
} from "../internal-types"
import { chainHeadFollow } from "./chainHeadFollow"
import { txSubmitAndWatch } from "./transaction-submit-watch"

export const addSubscription = ({
  onSent,
  onNotification,
  onAbort,
}: SubscriptionLogic) => {
  const preActive = new Map<
    RequestId,
    (parsed: any) => { id: SubscriptionId } | null
  >()
  const active = new Set<SubscriptionId>()

  return {
    onSent(parsed: any) {
      const result = onSent(parsed)
      if (!result) return
      if (result.type === "subscribe") {
        preActive.set(result.id, result.onRes)
      } else {
        active.delete(result.id)
      }
    },
    onResponse(parsed: any) {
      const match = preActive.get(parsed.id)?.(parsed)
      if (!match) return
      preActive.delete(parsed.id)
      active.add(match.id)
    },
    onNotifiaction(parsed: any) {
      const result = onNotification(parsed)
      if (!result) return
      active.delete(result.id)
    },
    onAbort(): Array<JsonMessage> {
      preActive.clear()
      const result = [...active].map(onAbort)
      active.clear()
      return result
    },
  }
}

export const getSubscriptionManager = () => {
  const subscriptions = [chainHeadFollow, txSubmitAndWatch].map((logic) =>
    addSubscription(logic),
  )

  return {
    onSent(parsed: any) {
      subscriptions.forEach((s) => {
        s.onSent(parsed)
      })
    },
    onResponse(parsed: any) {
      subscriptions.forEach((s) => {
        s.onResponse(parsed)
      })
    },
    onNotifiaction(parsed: any) {
      subscriptions.forEach((s) => {
        s.onNotifiaction(parsed)
      })
    },
    onAbort(): Array<JsonMessage> {
      return subscriptions.map((s) => s.onAbort()).flat()
    },
  }
}
