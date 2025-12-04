import { getHasherFromHeader, type Hasher } from "@/hashers"
import { blockHeader, HexString } from "@polkadot-api/substrate-bindings"
import {
  BestBlockChanged,
  ChainHead,
  Finalized,
  FollowEventWithRuntime,
  FollowResponse,
  Initialized,
  NewBlockWithRuntime,
  StopError,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  ObservedValueOf,
  ReplaySubject,
  Subscription,
  combineLatest,
  defer,
  map,
  mergeMap,
  noop,
  of,
  share,
} from "rxjs"
import { fromAbortControllerFn } from "../enhancers"

type EnhancedFollowEventWithRuntime =
  | (Initialized & {
      number: number
      parentHash: string
      runtimeChanges: Map<string, string> // block-hash -> code-hash
      hasNewRuntime: boolean
    })
  | (NewBlockWithRuntime & { codeHash?: string })
  | BestBlockChanged
  | Finalized

const createGetRuntimeChanges = (
  getCodeHash: (block: string) => Observable<string>,
) => {
  const getRuntimeChanges = (
    blocks: Array<string>,
    firstId: { idx: number; id: string },
    lastId: { idx: number; id: string },
  ): Observable<Array<[string, string]>> => {
    const firstBlock = blocks[firstId.idx]
    const lastBlock = blocks[lastId.idx]
    if (blocks.length === 2)
      return of([
        [firstBlock, firstId.id],
        [lastBlock, lastId.id],
      ])

    const middleIdx = firstId.idx + Math.floor((lastId.idx - firstId.idx) / 2)
    return getCodeHash(blocks[middleIdx]).pipe(
      mergeMap((id) => {
        const middle = { id, idx: middleIdx }
        if (middle.id === firstId.id)
          return getRuntimeChanges(blocks, middle, lastId)

        return middle.id === lastId.id
          ? getRuntimeChanges(blocks, firstId, middle)
          : combineLatest([
              getRuntimeChanges(blocks, firstId, middle),
              getRuntimeChanges(blocks, middle, lastId),
            ]).pipe(map(([left, [_SKIP, ...right]]) => [...left, ...right]))
      }),
    )
  }

  return (blocks: Array<string>): Observable<Array<[string, string]>> => {
    const [initialBlock] = blocks
    if (blocks.length === 1)
      return getCodeHash(initialBlock).pipe(map((x) => [[initialBlock, x]]))

    const lastIdx = blocks.length - 1
    return combineLatest([initialBlock, blocks[lastIdx]].map(getCodeHash)).pipe(
      mergeMap(([firstId, lastId]) =>
        firstId === lastId
          ? of([[initialBlock, firstId] as [string, string]])
          : getRuntimeChanges(
              blocks,
              { idx: 0, id: firstId },
              { idx: lastIdx, id: lastId },
            ),
      ),
    )
  }
}

const withEnhancedFollow = (
  getFollower: () => FollowResponse,
  getCodeHash: (block: string) => Observable<string>,
  reset: () => void,
) => {
  const getRuntimeChanges = createGetRuntimeChanges(getCodeHash)
  const getRawHeader = (blockHash: HexString) =>
    defer(() => getFollower().header(blockHash))
  const hasher$ = new ReplaySubject<Hasher>(1)

  const getInnerObservables = (
    event: FollowEventWithRuntime | { type: "stop-error" },
  ): Observable<EnhancedFollowEventWithRuntime> | void => {
    if (event.type === "initialized") {
      const [blockHash] = event.finalizedBlockHashes
      return combineLatest([
        getRawHeader(blockHash),
        getRuntimeChanges(event.finalizedBlockHashes),
      ]).pipe(
        map(([rawHeader, changes]) => {
          if (!hasher$.closed) {
            hasher$.next(getHasherFromHeader(rawHeader, blockHash))
            hasher$.complete()
          }
          const { number, parentHash, digests } = blockHeader.dec(rawHeader)
          return {
            type: "initialized",
            finalizedBlockHashes: event.finalizedBlockHashes,
            runtimeChanges: new Map(changes),
            number,
            parentHash,
            hasNewRuntime: digests.some((d) => d.type === "runtimeUpdated"),
          }
        }),
      )
    }

    if (event.type === "newBlock" && event.newRuntime)
      return getCodeHash(event.blockHash).pipe(
        map((codeHash) => ({
          ...event,
          codeHash,
        })),
      )
  }

  const enhancer = (
    base: Observable<FollowEventWithRuntime | { type: "stop-error" }>,
  ) =>
    new Observable<EnhancedFollowEventWithRuntime | { type: "stop-error" }>(
      (observer) => {
        let pending: Array<FollowEventWithRuntime> | null = null
        let inner: Subscription | undefined
        const next = (v: FollowEventWithRuntime) =>
          pending?.push(v) || evaluateValue(v)
        const evaluateValue = (v: FollowEventWithRuntime) => {
          const obs = getInnerObservables(v)
          if (obs) {
            pending = []
            inner = obs.subscribe({
              next: (o) => {
                const copy = [...pending!]
                pending = null
                observer.next(o)
                copy.forEach(next)
              },
              error: reset,
            })
          } else observer.next(v as EnhancedFollowEventWithRuntime)
        }

        const outter = base.subscribe((event) => {
          if (event.type === "stop-error") {
            inner?.unsubscribe()
            pending = null
            observer.next(event)
          } else next(event)
        })
        return () => {
          inner?.unsubscribe()
          outter.unsubscribe()
        }
      },
    )

  return {
    getHeader: (blockHash: HexString) =>
      getRawHeader(blockHash).pipe(map(blockHeader[1])),
    hasher$: hasher$.asObservable(),
    enhancer,
  }
}

export const getFollow$ = (
  chainHead: ChainHead,
  withRecoveryFn: <A extends Array<any>, T>(
    inputFn: (...args: A) => Observable<T>,
  ) => (...args: A) => Observable<T>,
) => {
  let follower: FollowResponse | null = null
  let isDone = false
  let unfollow: () => void = () => {
    isDone = true
  }

  const getFollower = () => {
    if (!follower) throw new Error("Missing chainHead subscription")
    return follower
  }

  const getCodeHash = withRecoveryFn(
    fromAbortControllerFn(
      (blockHash: string, abortSignal: AbortSignal) =>
        // ":code" => "0x3a636f6465"
        getFollower().storage(
          blockHash,
          "hash",
          "0x3a636f6465",
          null,
          abortSignal,
        ) as Promise<string>,
    ),
  )

  let reset = noop
  const { hasher$, enhancer, getHeader } = withEnhancedFollow(
    getFollower,
    getCodeHash,
    () => reset(),
  )

  const follow$ = new Observable<
    | FollowEventWithRuntime
    | {
        type: "stop-error"
      }
  >((observer) => {
    if (isDone) return observer.complete()
    let token: any

    const setFollower = () => {
      follower = chainHead(
        true,
        (msg) => observer.next(msg),
        (e) => {
          follower = null
          if (isDone) return

          if (e instanceof Error && e.name === StopError.errorName) {
            setFollower()
            observer.next({ type: "stop-error" })
          } else {
            console.warn("ChainHead follow request failed, retrying…", e)
            token = setTimeout(setFollower, 250)
          }
        },
      )
    }

    reset = () => {
      // This causes all the ongoing operations to unsubscribe
      // so that they won't error when we trigger `unfollow`
      observer.next({ type: "stop-error" } as any)
      clearTimeout(token)
      follower?.unfollow()
      setFollower()
    }
    setFollower()
    unfollow = () => {
      isDone = true
      clearTimeout(token)
      observer.complete()
      follower?.unfollow()
    }
  }).pipe(enhancer, share())

  return {
    getHeader,
    hasher$,
    getFollower,
    follow$,
    unfollow: () => {
      unfollow()
    },
  }
}

export type FollowEvent =
  | ObservedValueOf<
      ReturnType<ReturnType<typeof withEnhancedFollow>["enhancer"]>
    >
  | { type: "stop-error" }
