import { JsonRpcMessage, JsonRpcRequest } from "@polkadot-api/json-rpc-provider"
import { InnerJsonRpcProvider } from "@polkadot-api/json-rpc-provider-proxy"
import { createClient } from "@polkadot-api/raw-client"
import { noop } from "@polkadot-api/utils"
import { Middleware } from "../types"

export const apply =
  (...middlewares: Middleware[]): Middleware =>
  (base) =>
    middlewares.reduce((a, b) => b(a), base)

export const jsonObj = <T extends {}>(input: T) => ({
  jsonrpc: "2.0" as const,
  ...input,
})

export const operationNotification = <T extends {}>(
  subscription: string,
  event: string,
  operationId?: string,
  innerResult: T = {} as T,
) =>
  jsonObj({
    method: "chainHead_v1_followEvent",
    params: {
      subscription,
      result: {
        event,
        operationId,
        ...innerResult,
      },
    },
  })

export const getRequest = (base: InnerJsonRpcProvider) => {
  let clientSend: (msg: JsonRpcRequest) => void = noop
  let clientReceive: (msg: JsonRpcMessage) => void = noop

  const cleanup = () => {
    clientSend = noop
    clientReceive = noop
  }

  const { request } = createClient((clientMsg) => {
    clientReceive = clientMsg
    return {
      disconnect: noop,
      send(x) {
        clientSend(x)
      },
    }
  })

  const simpleRequest = <Args extends Array<any>, Payload>(
    method: string,
    params: Args,
    onSuccess: (value: Payload) => void,
    onError: (e: any) => void,
  ): (() => void) => request(method, params, { onSuccess, onError })

  const provider: InnerJsonRpcProvider = (onMsg, onHalt) => {
    const { send, disconnect } = base(
      (msg) => {
        clientReceive(msg)
        onMsg(msg)
      },
      (e) => {
        cleanup()
        onHalt(e)
      },
    )
    clientSend = send
    return {
      send,
      disconnect() {
        cleanup()
        disconnect()
      },
    }
  }
  return { provider, request, simpleRequest }
}
