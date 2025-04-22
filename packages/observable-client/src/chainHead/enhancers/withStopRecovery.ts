import { Observable, ObservedValueOf, Subscription } from "rxjs"
import { BlockNotPinnedError } from "../errors"
import { PinnedBlocks } from "../streams"

export function withStopRecovery<A extends Array<any>, T>(
  blocks$: Observable<PinnedBlocks>,
  fn: (hash: string, ...args: A) => Observable<T>,
  label: string,
) {
  return (hash: string, ...args: A) => {
    const source$ = fn(hash, ...args)

    return new Observable<ObservedValueOf<typeof source$>>((observer) => {
      let sourceSub: Subscription | null = null
      let isSubscribed = false
      const performSourceSub = () => {
        if (isSubscribed) return
        isSubscribed = true
        sourceSub = source$.subscribe({
          next: (v) => observer.next(v),
          error: (e) => observer.error(e),
          complete: () => observer.complete(),
        })
        sourceSub.add(() => {
          isSubscribed = false
          sourceSub = null
        })
      }

      let isRecovering = false
      const blockSub = blocks$.subscribe({
        next: (v) => {
          const block = v.blocks.get(hash)
          if (!block) {
            // This branch used to conflict with BlockPrunedError, as the block might disappear when it gets pruned
            // We can avoid this conflict by checking that we're actually recovering.
            if (isRecovering) {
              observer.error(new BlockNotPinnedError(hash, label))
            }
          } else if (block.recovering) {
            // Pause while it's recovering, as we don't know if the block is there
            sourceSub?.unsubscribe()
          } else {
            performSourceSub()
          }
          isRecovering = v.recovering
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
