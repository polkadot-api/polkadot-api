import { BlockHeader, blockHeader } from "@polkadot-api/substrate-bindings"
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
  Subscription,
  connectable,
  noop,
} from "rxjs"

type EnhancedFollowEventWithRuntime =
  | (Initialized & {
      number: number
      parentHash: string
      runtimeChanges: Set<string>
    })
  | NewBlockWithRuntime
  | BestBlockChanged
  | Finalized

const createGetRuntimeChanges = (
  getCodeHash: (block: string) => Promise<string>,
) => {
  const getRuntimeChanges = async (
    blocks: Array<string>,
    firstId: { idx: number; id: string },
    lastId: { idx: number; id: string },
  ): Promise<Array<string>> => {
    const firstBlock = blocks[firstId.idx]
    const lastBlock = blocks[lastId.idx]
    if (blocks.length === 2) return [firstBlock, lastBlock]

    const middleIdx = firstId.idx + Math.floor((lastId.idx - firstId.idx) / 2)
    const middle = {
      idx: middleIdx,
      id: await getCodeHash(blocks[middleIdx]),
    }

    if (middle.id === firstId.id)
      return getRuntimeChanges(blocks, middle, lastId)

    if (middle.id === lastId.id)
      return getRuntimeChanges(blocks, firstId, middle)

    const [left, [_SKIP, ...right]] = await Promise.all([
      getRuntimeChanges(blocks, firstId, middle),
      getRuntimeChanges(blocks, middle, lastId),
    ])
    return [...left, ...right]
  }

  return async (blocks: Array<string>): Promise<Array<string>> => {
    if (blocks.length < 2) return blocks

    const lastIdx = blocks.length - 1
    const [initialBlock] = blocks
    const lastBlock = blocks[lastIdx]

    const [firstId, lastId] = await Promise.all(
      [initialBlock, lastBlock].map(getCodeHash),
    )
    if (firstId === lastId) return [blocks[0]]

    return getRuntimeChanges(
      blocks,
      { idx: 0, id: firstId },
      { idx: lastIdx, id: lastId },
    )
  }
}

const withInitializedNumber = (
  getHeader: (hash: string) => Promise<BlockHeader>,
  getCodeHash: (block: string) => Promise<string>,
) => {
  const getRuntimeChanges = createGetRuntimeChanges(getCodeHash)
  return (source$: Observable<FollowEventWithRuntime>) =>
    new Observable<EnhancedFollowEventWithRuntime>((observer) => {
      let pending: Array<EnhancedFollowEventWithRuntime> | null = null
      return source$.subscribe({
        next(event) {
          if (event.type === "initialized") {
            pending = []
            Promise.all([
              getHeader(event.finalizedBlockHashes[0]),
              getRuntimeChanges(event.finalizedBlockHashes),
            ])
              .then(([header, changes]) => {
                if (!observer.closed) {
                  observer.next({
                    type: "initialized",
                    finalizedBlockHashes: event.finalizedBlockHashes,
                    runtimeChanges: new Set(changes),
                    number: header.number,
                    parentHash: header.parentHash,
                  })
                  pending!.forEach((e) => {
                    observer.next(e)
                  })
                  pending = null
                }
              })
              .catch((e) => {
                if (!observer.closed) observer.error(e)
              })
          } else if (pending) pending.push(event)
          else observer.next(event)
        },
        error(e) {
          observer.error(e)
        },
        complete() {
          observer.complete()
        },
      })
    })
}

export const getFollow$ = (chainHead: ChainHead) => {
  let follower: FollowResponse | null = null
  let unfollow: () => void = noop

  const getFollower = () => {
    if (!follower) throw new Error("Missing chainHead subscription")
    return follower
  }

  const getHeader = (hash: string) =>
    getFollower().header(hash).then(blockHeader.dec)

  const getCodeHash = async (blockHash: string) =>
    // ":code" => "0x3a636f6465"
    getFollower().storage(
      blockHash,
      "hash",
      "0x3a636f6465",
      null,
    ) as Promise<string>

  const follow$ = connectable(
    new Observable<FollowEventWithRuntime>((observer) => {
      follower = chainHead(
        true,
        (e) => {
          observer.next(e)
        },
        (e) => {
          follower = null
          observer.error(e)
        },
      )
      unfollow = () => {
        observer.complete()
        follower?.unfollow()
      }
    }).pipe(
      withInitializedNumber(getHeader, getCodeHash),
      retryChainHeadError(),
    ),
  )

  const startFollow = () => {
    follow$.connect()
    return () => {
      unfollow()
    }
  }

  return {
    getHeader,
    getFollower,
    startFollow,
    follow$,
  }
}

const retryChainHeadError =
  <T extends { type: string }>() =>
  (source$: Observable<T>) =>
    new Observable<
      | T
      | {
          type: "stop-error"
        }
    >((observer) => {
      const subscription = new Subscription()
      const subscribe = () =>
        source$.subscribe({
          next: (v) => observer.next(v),
          error: (e) => {
            subscription.add(subscribe())
            if (e instanceof StopError) {
              observer.next({ type: "stop-error" })
            } else {
              console.warn("ChainHead follow request failed, retrying…", e)
            }
          },
          complete: () => observer.complete(),
        })
      subscription.add(subscribe())
      return subscription
    })

export type FollowEvent =
  | ObservedValueOf<ReturnType<ReturnType<typeof withInitializedNumber>>>
  | { type: "stop-error" }
