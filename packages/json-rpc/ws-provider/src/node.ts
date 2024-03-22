// @ts-ignore
import { WebSocket } from "ws"
import { getWebSocketProvider } from "./ws-provider"
export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

class WS extends WebSocket {
  close() {
    ;(this as any).terminate()
  }
}

export const WebSocketProvider = getWebSocketProvider(WS as any)
