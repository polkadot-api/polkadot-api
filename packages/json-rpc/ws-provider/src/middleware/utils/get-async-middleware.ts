import { JsonRpcMessage, JsonRpcRequest } from "@polkadot-api/json-rpc-provider"
import { createClient } from "@polkadot-api/raw-client"
import { noop } from "@polkadot-api/utils"
import { Middleware } from "../types"

export const getAsyncMiddleware =
  (
    input: (
      onResult: (x: Middleware | null) => void,
      request: ReturnType<typeof createClient>["request"],
    ) => () => void,
  ): Middleware =>
  (base) =>
  (onMessageOut, onHaltOut) => {
    // null -> loading
    // undefined -> destroyed
    //
    let interceptedMessage: (msg: JsonRpcMessage) => void = noop
    let pending: Array<JsonRpcRequest> = []
    let send = (msg: JsonRpcRequest) => {
      pending.push(msg)
    }
    let stopRequest = noop
    let isOn = true
    let done = () => {
      isOn = false
      pending = []
      stopRequest()
      done = interceptedMessage = interceptedHalt = stopRequest = noop
    }

    let interceptedHalt = (e?: any) => {
      done()
      onHaltOut(e)
    }
    const innerCon = base(interceptedMessage, interceptedHalt)
    let { disconnect } = innerCon
    const { request } = createClient((innerClientOnMsg) => {
      interceptedMessage = innerClientOnMsg
      return { ...innerCon, disconnect: noop }
    })

    if (isOn)
      stopRequest = input((cb) => {
        stopRequest = noop
        if (!cb) {
          interceptedHalt()
        } else {
          ;({ send, disconnect } = cb((onMiddleMsg, onMiddleHalt) => {
            interceptedHalt = (e?: any) => {
              done()
              onMiddleHalt(e)
            }
            interceptedMessage = onMiddleMsg
            return innerCon
          })(onMessageOut, onHaltOut))
          pending.forEach(send)
          pending = []
        }
      }, request)

    return {
      send: (msg) => {
        send(msg)
      },
      disconnect: () => {
        done()
        disconnect()
      },
    }
  }
