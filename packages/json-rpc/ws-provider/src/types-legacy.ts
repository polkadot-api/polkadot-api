import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { StatusChange, WsJsonRpcProvider } from "./types-common"

export interface WsProviderConfig {
  endpoints: Array<string | { uri: string; protocol: string[] }>
  onStatusChanged?: (status: StatusChange) => void
  timeout?: number
  innerEnhancer?: (input: JsonRpcProvider) => JsonRpcProvider
}

export interface GetWsProviderInput {
  (
    uri: string,
    protocols?: string | string[],
    onStatusChanged?: (status: StatusChange) => void,
  ): WsJsonRpcProvider
  (
    uri: string,
    onStatusChanged?: (status: StatusChange) => void,
  ): WsJsonRpcProvider
  (
    endpoints: Array<string | { uri: string; protocol: string[] }>,
    onStatusChanged?: (status: StatusChange) => void,
  ): WsJsonRpcProvider
  (wsProviderConfig: WsProviderConfig): WsJsonRpcProvider
}
