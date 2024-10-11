import { WebSocket } from "ws"
import { getInternalWsProvider, type GetWsProviderInput } from "./ws-provider"
export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

export type * from "./ws-provider"
export { WsEvent } from "./ws-provider"

class WS extends WebSocket {
  close() {
    this.terminate()
  }
}

export const getWsProvider: GetWsProviderInput = getInternalWsProvider(
  WS as unknown as typeof globalThis.WebSocket,
)
