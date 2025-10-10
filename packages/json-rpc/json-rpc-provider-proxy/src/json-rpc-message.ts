import {
  JsonRpcError,
  JsonRpcId,
  JsonRpcRequest,
  JsonRpcResponse,
} from "@polkadot-api/json-rpc-provider"

export const jsonRpcReq = (
  msg: Omit<JsonRpcRequest, "jsonrpc">,
): JsonRpcRequest => ({
  jsonrpc: "2.0" as "2.0",
  ...msg,
})

export const jsonRpcRsp = <T = any>(
  msg: { id: JsonRpcId } & (
    | {
        result: T
      }
    | {
        error: JsonRpcError<T>
      }
  ),
): JsonRpcResponse => ({
  jsonrpc: "2.0" as "2.0",
  ...msg,
})
