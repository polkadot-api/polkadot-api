import { StopError } from "@polkadot-api/substrate-client"
import { Observable, ObservedValueOf, Subscription, map } from "rxjs"
import { BlockNotPinnedError } from "../errors"
import { PinnedBlocks } from "../streams"

export function withStopRecovery<A extends Array<any>, T>(
  blocks$: Observable<PinnedBlocks>,
  fn: (hash: string, ...args: A) => Observable<T>,
) {
  return (hash: string, ...args: A) => {
    const source$ = fn(hash, ...args)
    const block$ = blocks$.pipe(map(({ blocks }) => blocks.get(hash)))

    return new Observable<ObservedValueOf<typeof source$>>((observer) => {
      let sourceSub: Subscription | null = null
      const performSourceSub = () => {
        if (sourceSub) return
        sourceSub = source$.subscribe({
          next: (v) => observer.next(v),
          error: (e) => {
            return e instanceof StopError ? null : observer.error(e)
          },
          complete: () => observer.complete(),
        })
      }

      const blockSub = block$.subscribe({
        next: (v) => {
          if (!v) {
            observer.error(new BlockNotPinnedError())
          } else if (v.recovering) {
            // Pause while it's recovering, as we don't know if the block is there
            sourceSub?.unsubscribe()
            sourceSub = null
          } else {
            performSourceSub()
          }
        },
        error: (e) => observer.error(e),
      })

      return () => {
        blockSub.unsubscribe()
        sourceSub?.unsubscribe()
      }
    })
  }
}
