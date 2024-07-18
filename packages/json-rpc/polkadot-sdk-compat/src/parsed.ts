import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"

export interface ParsedJsonRpcConnection {
  send: <T extends {}>(message: T) => void
  disconnect: () => void
}

export type ParsedJsonRpcProvider = (
  onMesage: <T extends {}>(message: T) => void,
) => ParsedJsonRpcConnection

export type ParsedJsonRpcEnhancer = (
  base: ParsedJsonRpcProvider,
) => ParsedJsonRpcProvider

export const toParsed = (base: JsonRpcProvider): ParsedJsonRpcProvider => {
  let _onMsg: null | (<T extends {}>(msg: T) => void) = null
  const { send, disconnect } = base((msg) => {
    _onMsg?.(JSON.parse(msg))
  })

  return (onMsg) => {
    _onMsg = onMsg
    return {
      send(msg) {
        send(JSON.stringify(msg))
      },
      disconnect() {
        _onMsg = null
        disconnect()
      },
    }
  }
}

export const fromParsed = (base: ParsedJsonRpcProvider): JsonRpcProvider => {
  let _onMsg: null | ((msg: string) => void) = null
  const { send, disconnect } = base((msg) => {
    _onMsg?.(JSON.stringify(msg))
  })

  return (onMsg) => {
    _onMsg = onMsg
    return {
      send(msg) {
        send(JSON.parse(msg))
      },
      disconnect() {
        _onMsg = null
        disconnect()
      },
    }
  }
}

export const parsed =
  (
    ...enhancers: Array<ParsedJsonRpcEnhancer>
  ): ((base: JsonRpcProvider) => JsonRpcProvider) =>
  (base) =>
    fromParsed(enhancers.reduce((a, b) => b(a), toParsed(base)))
