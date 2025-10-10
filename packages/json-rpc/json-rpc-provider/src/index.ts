export type JsonRpcId = string | number | null

export type JsonRpcRequest<T = any> = {
  jsonrpc: "2.0"
  method: string
  params?: T
  id?: JsonRpcId
}

export type JsonRpcError<T = any> = {
  code: number
  message: string
  data?: T
}

export type JsonRpcResponse<T = any> = {
  jsonrpc: "2.0"
  id: JsonRpcId
} & (
  | {
      result: T
    }
  | {
      error: JsonRpcError<T>
    }
)

export type JsonRpcMessage<T = any> = JsonRpcRequest<T> | JsonRpcResponse<T>

export interface JsonRpcConnection<T = any> {
  send: (message: JsonRpcRequest<T>) => void
  disconnect: () => void
}

export declare type JsonRpcProvider<T = any> = (
  onMessage: (message: JsonRpcMessage<T>) => void,
) => JsonRpcConnection

export const isRequest = <T>(
  msg: JsonRpcMessage<T>,
): msg is JsonRpcRequest<T> => "method" in msg

export const isResponse = <T>(
  msg: JsonRpcMessage<T>,
): msg is JsonRpcResponse<T> => !("method" in msg)
