import {
  JsonRpcConnection,
  JsonRpcMessage,
} from "@polkadot-api/json-rpc-provider"
import { InnerJsonRpcProvider } from "./public-types"

export interface ConnectableJsonRpcConnection<
  T = any,
> extends JsonRpcConnection {
  connect: (cb: InnerJsonRpcProvider<T>) => void
}
export type ReconnectableJsonRpcConnection = (
  toConsumer: (msg: JsonRpcMessage) => void,
) => ConnectableJsonRpcConnection
