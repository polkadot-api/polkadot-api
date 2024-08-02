import { getInternalWsProvider } from "./ws-provider"

export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
export const getWsProvider = getInternalWsProvider(WebSocket)
