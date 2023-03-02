import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { getSubscribe } from "./subscribe"
import { getEvent } from "./event"
import { getCall } from "./call"
import { getTx } from "./tx"
import { createErrorReader, SolidityError } from "../descriptors"

export const createClient = (
  getProvider: () => JsonRpcProvider,
  unhandledErrors: Array<SolidityError<any, any>>,
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

  const getError = createErrorReader(unhandledErrors)

  return {
    getError,
    request,
    call: getCall(request, getError, logger),
    tx: getTx(request, getError, logger),
    subscribe,
    event: getEvent(subscribe),
  }
}

export type SolidityClient = ReturnType<typeof createClient>
