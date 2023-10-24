import type {
  RequestId,
  SubscriptionId,
  SubscriptionLogic,
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

  const onDisconnect = () => {
    preActive.clear()
    active.clear()
  }

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
    onDisconnect,
    onAbort() {
      const activeCopy = [...active]
      onDisconnect()
      activeCopy.forEach(onAbort)
    },
  }
}

export const getSubscriptionManager = (onMessage: (msg: string) => void) => {
  const subscriptions = [chainHeadFollow, txSubmitAndWatch].map((logic) =>
    addSubscription(logic(onMessage)),
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
    onDisconnect() {
      subscriptions.forEach((s) => s.onDisconnect())
    },
    onAbort() {
      subscriptions.forEach((s) => s.onAbort())
    },
  }
}
