import { WebSocket } from "ws"
import { getLegacyWsProvider } from "./legacy-provider"
export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

export * from "./types-common"
export * from "./types-legacy"

class WS extends WebSocket {
  close() {
    this.terminate()
  }
}

/**
 * @deprecated This export will be removed in PAPI v2. Migrate as follows:
 *             `import { getWsProvider } from "polkadot-api/ws-provider"
 */
export const getWsProvider = getLegacyWsProvider(
  WS as unknown as typeof globalThis.WebSocket,
)
