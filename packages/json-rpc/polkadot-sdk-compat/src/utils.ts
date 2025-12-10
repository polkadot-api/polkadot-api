import { ParsedJsonRpcProvider } from "./parsed"

export const jsonObj = <T extends {}>(input: T) => ({
  jsonrpc: "2.0",
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

const requestPrefix = "__INNER_RQ_DesV"
export const getRequest = (base: ParsedJsonRpcProvider) => {
  let nextId = 0
  const onGoingRequests = new Map<string, (ok: boolean, x: any) => void>()

  const listener: <T extends { id: string; result: T; error?: any }>(
    msg: T,
  ) => boolean = ({ id, error, result }) => {
    const callback = onGoingRequests.get(id)
    if (callback) {
      onGoingRequests.delete(id)
      if (error) callback(false, error)
      else callback(true, result)
    }
    return !callback
  }

  let send: <T extends {}>(msg: T) => void = () => {}
  const provider: ParsedJsonRpcProvider = (onMsg) => {
    const { send: _send, disconnect } = base((msg) => {
      if (listener(msg as any)) onMsg(msg)
    })
    send = _send
    return {
      send,
      disconnect: () => {
        onGoingRequests.clear()
        disconnect()
      },
    }
  }

  const request = <T>(
    method: string,
    params: Array<any>,
    onSuccess: (x: T) => void,
    onError: (e: any) => void,
  ): void => {
    const id = requestPrefix + nextId++
    onGoingRequests.set(id, (isOk, value) => {
      ;(isOk ? onSuccess : onError)(value)
    })
    send(jsonObj({ id, method, params }))
  }

  return [provider, request] as const
}
