import { JsonRpcConnection } from "@polkadot-api/json-rpc-provider"
import { AsyncJsonRpcProvider } from "./public-types"

export interface ConnectableJsonRpcConnection extends JsonRpcConnection {
  connect: (cb: AsyncJsonRpcProvider) => void
}
export type ReconnectableJsonRpcConnection = (
  toConsumer: (msg: string) => void,
) => ConnectableJsonRpcConnection
