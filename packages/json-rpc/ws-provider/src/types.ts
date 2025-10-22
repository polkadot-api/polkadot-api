import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { InnerJsonRpcProvider } from "@polkadot-api/json-rpc-provider-proxy"

export enum WsEvent {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  ERROR = "ERROR",
  CLOSE = "CLOSE",
}

export type WsConnecting = {
  type: WsEvent.CONNECTING
  uri: string
}
export type WsConnected = {
  type: WsEvent.CONNECTED
  uri: string
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
  switch: (uri?: string) => void
  getStatus: () => StatusChange
}
export { type JsonRpcProvider }

export enum SocketEvents {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  TIMEOUT = "TIMEOUT",
  STALE = "STALE",
  ERROR = "ERROR",
  CLOSE = "CLOSE",
  DISCONNECT = "DISCONNECT",
  IN = "IN",
  OUT = "OUT",
}

type SocketLoggerEvent =
  | { type: SocketEvents.CONNECTING; url: string }
  | { type: SocketEvents.CONNECTED }
  | { type: SocketEvents.DISCONNECT }
  | { type: SocketEvents.ERROR; error: any }
  | { type: SocketEvents.CLOSE }
  | { type: SocketEvents.STALE }
  | { type: SocketEvents.TIMEOUT }
  | { type: SocketEvents.IN; msg: string }
  | { type: SocketEvents.OUT; msg: string }

export type SocketLoggerFn = (event: SocketLoggerEvent) => void

export type WebSocketClass = typeof WebSocket

export type { InnerJsonRpcProvider }
export type Middleware = (base: InnerJsonRpcProvider) => InnerJsonRpcProvider
