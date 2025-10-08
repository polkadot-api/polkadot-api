import { AsyncJsonRpcProvider } from "@polkadot-api/json-rpc-provider-proxy"
import { methods } from "./methods"
import { withNumericIds } from "./numeric-ids"
import { ParsedJsonRpcEnhancer } from "./types"

const layers = [withNumericIds, methods]

const _middleware: ParsedJsonRpcEnhancer = (base) =>
  layers.reduce((a, b) => b(a), base)

export const midleware =
  (input: AsyncJsonRpcProvider): AsyncJsonRpcProvider =>
  (onMsg, onHalt) => {
    const { send, disconnect } = _middleware((_onMsg, _onHalt) => {
      const { send, disconnect } = input((x) => {
        _onMsg(JSON.parse(x))
      }, _onHalt)
      return {
        disconnect,
        send(x) {
          send(JSON.stringify(x))
        },
      }
    })((m) => onMsg(JSON.stringify(m)), onHalt)

    return {
      disconnect,
      send(x) {
        send(JSON.parse(x))
      },
    }
  }
