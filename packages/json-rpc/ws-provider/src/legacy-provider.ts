import type { StatusChange, WsJsonRpcProvider } from "./types-common"
import type { GetWsProviderInput } from "./types-legacy"
import {
  getWsProvider,
  mapEndpoints,
  defaultConfig,
  noop,
} from "./default-provider"
import { type WebSocketClass } from "./types-new"

export const getLegacyWsProvider = (
  websocketClass: WebSocketClass,
): GetWsProviderInput => {
  return (...args): WsJsonRpcProvider => {
    let endpoints: Array<[string, string | string[]] | [string]> = []
    let { heartbeatTimeout, timeout, innerEnhancer, onStatusChanged } =
      defaultConfig

    const [firstArg] = args
    if (
      args.length === 1 &&
      typeof firstArg === "object" &&
      !Array.isArray(firstArg)
    ) {
      endpoints = mapEndpoints(firstArg.endpoints)
      onStatusChanged = firstArg.onStatusChanged ?? noop
      timeout = firstArg.timeout ?? timeout
      heartbeatTimeout = firstArg.heartbeatTimeout ?? heartbeatTimeout
      innerEnhancer = firstArg.innerEnhancer ?? ((x) => x)
    } else {
      if (typeof args[1] === "function")
        onStatusChanged = args[1] as (status: StatusChange) => void
      if (Array.isArray(firstArg)) endpoints = mapEndpoints(firstArg)
      else {
        endpoints = [[firstArg as string]]
        if (args[1] && args[1] !== onStatusChanged)
          endpoints[0][1] = args[1] as any
        if (args[2]) onStatusChanged = args[2] as any
      }
    }

    return getWsProvider(
      endpoints.map((x) =>
        x.length === 1
          ? x[0]
          : {
              uri: x[0],
              protocol: x[1],
            },
      ),
      {
        websocketClass,
        onStatusChanged,
        timeout,
        innerEnhancer,
      },
    )
  }
}
