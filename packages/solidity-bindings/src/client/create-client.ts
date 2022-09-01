import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { getSubscribe } from "./subscribe"
import { getEvent } from "./event"
import { getCall } from "./call"
import { getTx } from "./tx"

export const createClient = (
  getProvider: () => JsonRpcProvider,
  logger?: (meta: any) => void,
) => {
  const subscribe = getSubscribe(getProvider)
  const request = <T = any>(
    method: string,
    params: Array<any>,
    meta?: any,
  ): Promise<T> => {
    const rawRequest = { method, params }
    logger?.({ ...(meta || {}), rawRequest })
    return getProvider().request(rawRequest)
  }

  return {
    request,
    call: getCall(request, logger),
    tx: getTx(request, logger),
    subscribe,
    event: getEvent(subscribe),
  }
}

export type SolidityClient = ReturnType<typeof createClient>
