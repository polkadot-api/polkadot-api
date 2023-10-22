export type RequestId = string | number | null
export type SubscriptionId = string | number
export type JsonMessage = {
  jsonrpc: "2.0"
  method: string
  params: {}
}

export interface SubscriptionLogic {
  onSent: (parsed: any) =>
    | {
        type: "subscribe"
        id: RequestId
        onRes: (parsed: any) => { id: SubscriptionId } | null
      }
    | { type: "unsubscribe"; id: SubscriptionId }
    | null
  onNotification: (parsed: any) => { type: "end"; id: SubscriptionId } | null
  onAbort: (id: SubscriptionId) => JsonMessage
}
