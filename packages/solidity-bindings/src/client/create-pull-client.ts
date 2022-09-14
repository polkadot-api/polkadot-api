import type { JsonRpcProvider } from "@json-rpc-tools/provider"
import { getCall } from "./call"
import { getTx } from "./tx"
import { getCurrentBlockNumber$ } from "./pullNewsHead"
import { getPullingEvent } from "./getPullingEvent"
import {
  concatMap,
  distinctUntilChanged,
  from,
  map,
  merge,
  Observable,
  ReplaySubject,
  share,
} from "rxjs"

const fromEvent = <T = unknown>(provider: JsonRpcProvider, event: string) =>
  new Observable<T>((observer) => {
    const next = observer.next.bind(observer)
    provider.on(event, next)

    return () => {
      provider.removeListener(event, next)
    }
  })

export const createPullClient = (
  getProvider: () => Promise<JsonRpcProvider | undefined>,
  logger?: (meta: any) => void,
  minPullFrequency = 5_000,
  maxPullFrequency = 2_500,
) => {
  let providerPromise: Promise<JsonRpcProvider> = getProvider().then((p) => {
    if (!p) throw new Error("No Provider")
    return p
  })

  const chainId$: Observable<string | null> = from(providerPromise).pipe(
    concatMap((provider) => {
      const disconnected$: Observable<string | null> = fromEvent(
        provider,
        "disconnect",
      ).pipe(map(() => null))

      const chainChanged$: Observable<string | null> = fromEvent<string>(
        provider,
        "chainChanged",
      )
      return new Observable<string | null>((observer) => {
        provider.request<string>({ method: "eth_chainId", params: [] }).then(
          (chainId) => {
            observer.next(chainId)
          },
          () => {
            observer.next(null)
          },
        )
        return merge(disconnected$, chainChanged$).subscribe(observer)
      })
    }),
    distinctUntilChanged(),
    share({
      connector: () => new ReplaySubject(1),
    }),
  )

  const request = async <T = any>(
    method: string,
    params: Array<any>,
    meta?: any,
  ): Promise<T> => {
    const rawRequest = { method, params }
    logger?.({ ...(meta || {}), rawRequest })
    const provider = await providerPromise
    return provider.request(rawRequest)
  }

  const currentBlockNumber$ = getCurrentBlockNumber$(
    chainId$,
    request,
    minPullFrequency,
    maxPullFrequency,
    logger,
  )

  return {
    providerPromise,
    chainId$,
    request,
    currentBlockNumber$,
    call: getCall(request, logger),
    tx: getTx(request, logger),
    ...getPullingEvent(currentBlockNumber$, request, logger),
    logger,
  }
}

export type SolidityPullClient = ReturnType<typeof createPullClient>
