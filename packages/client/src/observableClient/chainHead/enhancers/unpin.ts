import {
  Finalized,
  FollowEventWithRuntime,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  Subject,
  concat,
  filter,
  ignoreElements,
  map,
  merge,
  mergeMap,
  pairwise,
  scan,
  skip,
  startWith,
  takeUntil,
} from "rxjs"

export const getWithUnpinning$ = (
  finalized$: Observable<string>,
  follow$: Observable<FollowEventWithRuntime>,
  unpin: (hashes: string[]) => void,
) => {
  const userUsageInput$ = new Subject<{
    type: "hold" | "release"
    hash: string
  }>()

  // We ensure that the latest finalized block always stays pinned
  const internalUsage$ = finalized$.pipe(
    startWith(""),
    pairwise(),
    mergeMap(([prev, current]) => [
      { type: "release" as "release", hash: prev },
      { type: "hold" as "hold", hash: current },
    ]),
    skip(1),
  )

  const userUsage$ = userUsageInput$.pipe(
    // we need to ensure that it completes when finalized$ completes
    takeUntil(concat(finalized$.pipe(ignoreElements()), [null])),
  )

  const unpinFromUsage$ = merge(userUsage$, internalUsage$).pipe(
    scan(
      (acc, usage) => {
        const newAcc = Object.fromEntries(
          Object.entries(acc).filter(([, value]) => value),
        )

        if (usage.type === "release") {
          newAcc[usage.hash]--
        } else {
          newAcc[usage.hash] ||= 0
          newAcc[usage.hash]++
        }

        return newAcc
      },
      {} as Record<string, number>,
    ),
    map((acc) =>
      Object.entries(acc)
        .filter(([, value]) => value === 0)
        .map(([key]) => key),
    ),
    filter((arr) => arr.length > 0),
  )

  const unpinFromPrunned$ = follow$.pipe(
    filter((e): e is Finalized => e.type === "finalized"),
    map((e) => e.prunedBlockHashes),
  )

  merge(unpinFromUsage$, unpinFromPrunned$).subscribe((hashes) => {
    unpin(hashes)
  })

  const onHold = (hash: string) => {
    userUsageInput$.next({ type: "hold", hash })
  }
  const onRelease = (hash: string) => {
    setTimeout(() => {
      userUsageInput$.next({ type: "release", hash })
    }, 0)
  }

  const withUnpinning$ =
    <Args extends Array<any>, T>(
      fn: (hash: string, ...args: Args) => Observable<T>,
    ) =>
    (hash: string, ...args: Args): Observable<T> => {
      const base$ = fn(hash, ...args)
      return new Observable<T>((observer) => {
        onHold(hash)
        const subscription = base$.subscribe(observer)
        return () => {
          subscription.unsubscribe()
          onRelease(hash)
        }
      })
    }

  return withUnpinning$
}
