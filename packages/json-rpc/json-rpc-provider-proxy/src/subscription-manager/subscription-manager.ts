import {
  MessageType,
  type RequestId,
  type SubscriptionId,
  type SubscriptionLogic,
} from "../internal-types"
import { chainHeadFollow } from "./chainHeadFollow"

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
      if (result) {
        if (result.type === MessageType.subscribe)
          preActive.set(result.id, result.onRes)
        else active.delete(result.id)
      }
    },
    onResponse(parsed: any) {
      const match = preActive.get(parsed.id)?.(parsed)
      if (match) {
        preActive.delete(parsed.id)
        active.add(match.id)
      }
    },
    onNotifiaction(parsed: any) {
      const result = onNotification(parsed)
      if (result) active.delete(result.id)
    },
    onDisconnect,
    onAbort() {
      const activeCopy = [...active]
      onDisconnect()
      activeCopy.forEach(onAbort)
    },
  }
}

export const getSubscriptionManager = (onMessage: (msg: string) => void) =>
  addSubscription(chainHeadFollow(onMessage))
