// @ts-ignore
import { WebSocket } from "ws"
import { getWebSocketProvider } from "./ws-provider"

export type { ConnectProvider } from "@polkadot-api/json-rpc-provider"
export const WebSocketProvider = getWebSocketProvider(WebSocket)
