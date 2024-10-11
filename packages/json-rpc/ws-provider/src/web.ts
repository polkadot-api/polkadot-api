import { getInternalWsProvider } from "./ws-provider"

export * from "./types"

export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
export const getWsProvider = getInternalWsProvider(WebSocket)
