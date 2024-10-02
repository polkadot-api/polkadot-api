import { JsonRpcConnection } from "@polkadot-api/json-rpc-provider"

export type AsyncJsonRpcProvider = (
  onMessage: (message: string) => void,
  onHalt: () => void,
) => JsonRpcConnection
