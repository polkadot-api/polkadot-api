import { JsonRpcProvider } from "@polkadot-api/substrate-client"
import { withLogs } from "./with-logs"

let { PROVIDER, VERSION } = process.env
export const innerEnhancer = (input: JsonRpcProvider): JsonRpcProvider =>
  withLogs(`./${VERSION}_${PROVIDER}_JSON_RPC_INNER_3`, input)
