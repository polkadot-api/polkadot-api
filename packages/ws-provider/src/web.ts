import { getWebSocketProvider } from "./ws-provider"

export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
export const WebSocketProvider = getWebSocketProvider(WebSocket)
