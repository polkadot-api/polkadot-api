import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { getCall } from "./call"
import { getTx } from "./tx"
import { getCurrentBlockNumber$ } from "./pullNewsHead"
import { getPullingEvent } from "./getPullingEvent"

export const createPullClient = (
  getProvider: () => JsonRpcProvider,
  minPullFrequency?: number,
) => {
  const request = <T = any>(method: string, params: Array<any>): Promise<T> =>
    getProvider().request({ method, params })

  const currentBlockNumber$ = getCurrentBlockNumber$(request, minPullFrequency)

  return {
    request,
    call: getCall(request),
    tx: getTx(request),
    currentBlockNumber$,
    event: getPullingEvent(currentBlockNumber$, request),
  }
}

export type SolidityPullClient = ReturnType<typeof createPullClient>
