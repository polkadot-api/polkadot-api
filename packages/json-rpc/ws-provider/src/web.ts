import { getInternalWsProvider, type GetWsProviderInput } from "./ws-provider"

export type * from "./ws-provider"
export { WsEvent } from "./ws-provider"

export type { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
export const getWsProvider: GetWsProviderInput =
  getInternalWsProvider(WebSocket)
