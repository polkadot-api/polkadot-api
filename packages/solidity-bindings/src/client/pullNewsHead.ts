import { getTrackingId, logResponse } from "../internal"
import {
  concatMap,
  filter,
  Observable,
  share,
  skip,
  take,
  takeUntil,
} from "rxjs"

export const getCurrentBlockNumber$ = (
  chainId$: Observable<string | null>,
  request: <T = any>(
    method: string,
    params: Array<any>,
    meta?: any,
  ) => Promise<T>,
  minPullFrequency: number,
  maxPullFrequency: number,
  logger?: (meta: any) => void,
) => {
  return chainId$.pipe(
    filter(Boolean),
    take(1),
    concatMap((chainId) => {
      const pullLatestBlockNumber = () => {
        const trackingId = getTrackingId()
        const type = "eth_blockNumber"
        const meta: any = logger && {
          type,
          trackingId,
        }
        return request<string>(type, [], meta)
          .then(parseInt)
          .then(...logResponse(meta, logger))
      }

      return new Observable<{ chainId: string; blockNumber: number }>(
        (observer) => {
          let token: any = -1
          let latestBlock = -1
          const startTime = Date.now() - (minPullFrequency + maxPullFrequency)
          let latestHit = Date.now()
          let nHits = 1

          const pull = () => {
            if (observer.closed) return

            const waitAndPull = () => {
              if (observer.closed) return
              const estimatedFrequency = (latestHit - startTime) / nHits
              const waitTime = Math.max(
                maxPullFrequency,
                Math.min(minPullFrequency, (estimatedFrequency / 2) | 0),
              )
              token = setTimeout(pull, waitTime)
            }

            pullLatestBlockNumber()
              .then((received) => {
                if (observer.closed) return
                if (received === latestBlock) return

                const prevBlock = latestBlock
                observer.next({
                  chainId,
                  blockNumber: (latestBlock = received),
                })
                if (prevBlock === -1 || nHits > 100) return
                latestHit = Date.now()
                nHits++
              })
              .then(waitAndPull, waitAndPull)
          }

          pull()

          return () => {
            clearTimeout(token)
          }
        },
      )
    }),
    takeUntil(chainId$.pipe(skip(1))),
    share(),
  )
}
