import { WebSocket } from "ws"
import { getInternalWsProvider } from "./ws-provider"
export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

export * from "./types"

class WS extends WebSocket {
  close() {
    this.terminate()
  }
}

export const getWsProvider = getInternalWsProvider(
  WS as unknown as typeof globalThis.WebSocket,
)
