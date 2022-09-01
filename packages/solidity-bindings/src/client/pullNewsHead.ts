import { Observable, share } from "rxjs"

export const getCurrentBlockNumber$ = (
  request: <T = any>(method: string, args: Array<any>) => Promise<T>,
  minPullFrequency = 5_000,
) => {
  const pullLatestBlockNumber = () =>
    request<string>("eth_blockNumber", []).then(parseInt)

  return new Observable<number>((observer) => {
    let token: any = -1
    let latestBlock = -1
    const startTime = Date.now() - minPullFrequency
    let latestHit = Date.now()
    let nHits = 1

    const pull = () => {
      const waitAndPull = () => {
        if (observer.closed) return
        const estimatedFrequency = (latestHit - startTime) / nHits
        const msTilNextBlock = latestHit + estimatedFrequency - Date.now()
        const maxWaitTime =
          msTilNextBlock > estimatedFrequency / 2
            ? msTilNextBlock
            : msTilNextBlock / 2
        const waitTime = Math.min(minPullFrequency, maxWaitTime | 0)
        token = setTimeout(pull, waitTime)
      }

      pullLatestBlockNumber()
        .then((received) => {
          if (observer.closed) return
          if (received === latestBlock) return

          const prevBlock = latestBlock
          observer.next((latestBlock = received))
          if (prevBlock === -1 || nHits > 1000) return
          latestHit = Date.now()
          nHits += latestBlock - prevBlock
        })
        .then(waitAndPull, waitAndPull)
    }

    pull()

    return () => {
      clearTimeout(token)
    }
  }).pipe(share())
}
