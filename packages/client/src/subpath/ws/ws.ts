import { createClient } from "../../client"
import { middleware } from "@polkadot-api/ws-middleware"
import {
  getWsProvider as _getWsProvider,
  type WebSocketClass,
  type StatusChange,
  type SocketLoggerFn,
} from "@polkadot-api/ws-provider"
export type {
  WsConnecting,
  WsConnected,
  WsError,
  WsClose,
  WsJsonRpcProvider,
} from "@polkadot-api/ws-provider"
export type { StatusChange, WebSocketClass, SocketLoggerFn }
export { SocketEvents, WsEvent } from "@polkadot-api/ws-provider"

export const getWsRawProvider = (
  endpoint: string | string[],
  config: Partial<{
    onStatusChanged: (status: StatusChange) => void
    timeout: number
    heartbeatTimeout: number
    websocketClass: WebSocketClass
    logger: SocketLoggerFn
  }> = {},
) => _getWsProvider(endpoint, config)

export const getWsProvider = (
  endpoint: string | string[],
  config: Partial<{
    onStatusChanged: (status: StatusChange) => void
    timeout: number
    heartbeatTimeout: number
    websocketClass: WebSocketClass
    logger: SocketLoggerFn
  }> = {},
) =>
  _getWsProvider(endpoint, {
    ...config,
    middleware,
  })

export const createWsClient = (
  endpoint: string | string[],
  config: Partial<{
    onStatusChanged: (status: StatusChange) => void
    timeout: number
    heartbeatTimeout: number
    websocketClass: WebSocketClass
    logger: SocketLoggerFn
    getMetadata: (codeHash: string) => Promise<Uint8Array | null>
    setMetadata: (codeHash: string, metadata: Uint8Array) => void
  }> = {},
) => {
  const provider = getWsProvider(endpoint, config)
  const client = createClient(provider, config)
  return Object.assign(client, {
    switch: provider.switch,
    getStatus: provider.getStatus,
  })
}
