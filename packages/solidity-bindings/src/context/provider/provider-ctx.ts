import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { getSubscribe } from "./subscribe"
import { getEvent } from "./event"
import { getCall } from "./call"
import { getTx } from "./tx"

export const providerCtx = (getProvider: () => JsonRpcProvider) => {
  const subscribe = getSubscribe(getProvider)
  const request = <T = any>(method: string, params: Array<any>): Promise<T> =>
    getProvider().request({ method, params })

  return {
    request,
    call: getCall(request),
    tx: getTx(request),
    subscribe,
    event: getEvent(subscribe),
  }
}

export type ProviderContext = ReturnType<typeof providerCtx>
