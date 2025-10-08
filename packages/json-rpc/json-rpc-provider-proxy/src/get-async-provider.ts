import { AsyncJsonRpcProvider, GenericRpcConnection } from "./public-types"

const noop = () => {}

export const getAsyncProvider =
  <T = string>(
    input: (
      onResult: (x: AsyncJsonRpcProvider<T> | null) => void,
    ) => () => void,
  ): AsyncJsonRpcProvider<T> =>
  (onMessage, _onHalt) => {
    // null -> loading
    // undefined -> destroyed
    let connection: GenericRpcConnection<T> | null | undefined = null

    let pending: Array<T> = []
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
