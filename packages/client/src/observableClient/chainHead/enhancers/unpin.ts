import {
  Finalized,
  FollowEventWithRuntime,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  Subject,
  filter,
  map,
  merge,
  mergeMap,
  pairwise,
  skip,
  startWith,
} from "rxjs"
import { lazyScan } from "@/utils"

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
      { type: "release" as "release", hash: prev, isUser: false },
      { type: "hold" as "hold", hash: current, isUser: false },
    ]),
    skip(1),
  )

  const userUsage$ = new Observable<{
    type: "hold" | "release"
    hash: string
    isUser: true
  }>((observer) => {
    const userSub = userUsageInput$.subscribe((value) => {
      observer.next({ ...value, isUser: true })
    })

    const finSub = finalized$.subscribe({
      error(e) {
        observer.error(e)
      },
      complete() {
        observer.complete()
      },
    })

    return () => {
      userSub.unsubscribe()
      finSub.unsubscribe()
    }
  })

  const unpinFromUsage$ = merge(internalUsage$, userUsage$).pipe(
    lazyScan(
      (acc, { isUser, type, hash }) => {
        const { counters, bestBlocks } = acc

        if (isUser && type === "hold" && !counters[hash]) {
          bestBlocks[hash] ||= 0
          bestBlocks[hash]++
          return acc
        }

        if (isUser && type === "release" && bestBlocks[hash]) {
          if (!--bestBlocks[hash]) delete bestBlocks[hash]
          return acc
        }

        for (const hash in counters) if (!counters[hash]) delete counters[hash]

        if (type === "release") {
          counters[hash]--
        } else {
          counters[hash] ||= 0
          counters[hash]++
          if (!isUser && bestBlocks[hash]) {
            counters[hash] += bestBlocks[hash]
            delete bestBlocks[hash]
          }
        }

        return acc
      },
      () => ({
        counters: {} as Record<string, number>,
        bestBlocks: {} as Record<string, number>,
      }),
    ),
    map((acc) =>
      Object.entries(acc.counters)
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
