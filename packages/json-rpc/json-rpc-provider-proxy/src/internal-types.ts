export type RequestId = string | number | null
export type SubscriptionId = string | number
export type JsonMessage = {
  jsonrpc: "2.0"
  method: string
  params: {}
}

export const enum MessageType {
  subscribe,
  unsubscribe,
  end,
}

export interface SubscriptionLogic {
  onSent: (parsed: any) =>
    | {
        type: MessageType.subscribe
        id: RequestId
        onRes: (parsed: any) => { id: SubscriptionId } | null
      }
    | { type: MessageType.unsubscribe; id: SubscriptionId }
    | null
  onNotification: (
    parsed: any,
  ) => { type: MessageType.end; id: SubscriptionId } | null
  onAbort: (id: SubscriptionId) => void
}
