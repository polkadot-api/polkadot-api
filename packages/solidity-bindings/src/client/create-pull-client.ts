import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { getCall } from "./call"
import { getTx } from "./tx"
import { getCurrentBlockNumber$ } from "./pullNewsHead"
import { getPullingEvent } from "./getPullingEvent"

export const createPullClient = (
  getProvider: () => JsonRpcProvider,
  logger?: (meta: any) => void,
  minPullFrequency?: number,
) => {
  const request = <T = any>(
    method: string,
    params: Array<any>,
    meta?: any,
  ): Promise<T> => {
    const rawRequest = { method, params }
    logger?.({ ...(meta || {}), rawRequest })
    return getProvider().request(rawRequest)
  }
  const currentBlockNumber$ = getCurrentBlockNumber$(
    request,
    minPullFrequency,
    logger,
  )

  return {
    request,
    call: getCall(request, logger),
    tx: getTx(request, logger),
    currentBlockNumber$,
    ...getPullingEvent(currentBlockNumber$, request, logger),
    logger,
  }
}

export type SolidityPullClient = ReturnType<typeof createPullClient>
