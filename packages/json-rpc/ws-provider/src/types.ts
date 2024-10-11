import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

export enum WsEvent {
  CONNECTING,
  CONNECTED,
  ERROR,
  CLOSE,
}
export type WsConnecting = {
  type: WsEvent.CONNECTING
  uri: string
  protocols?: string | string[]
}
export type WsConnected = {
  type: WsEvent.CONNECTED
  uri: string
  protocols?: string | string[]
}
export type WsError = {
  type: WsEvent.ERROR
  event: any
}
export type WsClose = {
  type: WsEvent.CLOSE
  event: any
}
export type StatusChange = WsConnecting | WsConnected | WsError | WsClose
export type WsJsonRpcProvider = JsonRpcProvider & {
  switch: (uri?: string, protocol?: string[]) => void
  getStatus: () => StatusChange
}
