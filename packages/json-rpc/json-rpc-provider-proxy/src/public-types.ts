import {
  JsonRpcConnection,
  JsonRpcMessage,
} from "@polkadot-api/json-rpc-provider"

export type InnerJsonRpcProvider<T = any> = (
  onMessage: (message: JsonRpcMessage<T>) => void,
  onHalt: (e?: any) => void,
) => JsonRpcConnection<T>
