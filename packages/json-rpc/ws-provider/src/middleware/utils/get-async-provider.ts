import {
  JsonRpcConnection,
  JsonRpcRequest,
} from "@polkadot-api/json-rpc-provider"
import { InnerJsonRpcProvider } from "@polkadot-api/json-rpc-provider-proxy"
import { noop } from "@polkadot-api/utils"

export const getAsyncProvider =
  <T = string>(
    input: (
      onResult: (x: InnerJsonRpcProvider<T> | null) => void,
    ) => () => void,
  ): InnerJsonRpcProvider<T> =>
  (onMessage, _onHalt) => {
    // null -> loading
    // undefined -> destroyed
    let connection: JsonRpcConnection<T> | null | undefined = null

    let pending: Array<JsonRpcRequest> = []
    const done = () => {
      stop()
      onHalt = stop = noop
      connection = undefined
      pending = []
    }
    let onHalt = (e?: any) => {
      done()
      _onHalt(e)
    }

    let stop = input((cb) => {
      stop = noop
      if (!cb) {
        onHalt()
      } else {
        connection = cb(onMessage, onHalt)
        pending.forEach((x) => connection?.send(x))
        pending = []
      }
    })

    return {
      send: (msg) => {
        if (connection) connection.send(msg)
        else if (connection === null) pending.push(msg)
      },
      disconnect: () => {
        const x = connection
        done()
        x?.disconnect()
      },
    }
  }
