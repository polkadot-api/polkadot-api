import {
  FollowEventWithRuntime,
  FollowResponse,
  Runtime,
  SubstrateClient,
  createClient,
} from "@polkadot-api/substrate-client"
import {
  ArgsWithPayloadCodec,
  DescriptorCommon,
  StorageDescriptor,
} from "@polkadot-api/substrate-bindings"
import { ScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import {
  EMPTY,
  Observable,
  catchError,
  distinctUntilChanged,
  map,
  mergeMap,
  repeat,
  scan,
  share,
  shareReplay,
  startWith,
  switchMap,
  withLatestFrom,
} from "rxjs"
import { unpinEnhancer } from "./enhancers/unpin"
import { limitOperationsEnhancer } from "./enhancers/limit-operations"
import { getCodecs$ } from "./codecs"
import type { PullClientStorage } from "./types"
import { createStorageEntry, type StorageEntry } from "./storage"

type Flatten<T extends Array<Array<any>>> = T extends [
  infer First,
  ...infer Rest,
]
  ? First extends Array<any>
    ? Rest extends Array<Array<any>>
      ? [...First, ...Flatten<Rest>]
      : First
    : []
  : []

export function createPullClient<
  StorageDescriptors extends Array<
    Array<
      StorageDescriptor<
        DescriptorCommon<string, string>,
        ArgsWithPayloadCodec<any, any>
      >
    >
  >,
>(
  substrateClient: WellKnownChain | string | SubstrateClient,
  ...descriptors: StorageDescriptors
): PullClientStorage<Flatten<StorageDescriptors>> {
  let follower: FollowResponse

  let client: SubstrateClient =
    typeof substrateClient === "string"
      ? createClient(ScProvider(substrateClient))
      : substrateClient

  const chainHead$ = new Observable<FollowEventWithRuntime>((observer) => {
    const enhancedChainhead = limitOperationsEnhancer(16)(
      unpinEnhancer(client.chainHead),
    )

    follower = enhancedChainhead(true, observer.next.bind(observer), (e) => {
      observer.error(e)
    })

    return () => {
      follower.unfollow()
    }
  }).pipe(
    catchError((e) => {
      console.warn("chainHead crashed")
      console.error(e)
      return EMPTY
    }),
    repeat(),
    share(),
  )

  const runtime$ = chainHead$.pipe(
    scan(
      (acc, event) => {
        if (event.type === "initialized") {
          acc.candidates.clear()
          acc.current = event.finalizedBlockRuntime
        }

        if (event.type === "newBlock" && event.newRuntime)
          acc.candidates.set(event.blockHash, event.newRuntime)

        if (event.type !== "finalized") return acc

        const [newRuntimeHash] = event.finalizedBlockHashes
          .filter((h) => acc.candidates.has(h))
          .slice(-1)
        if (newRuntimeHash) acc.current = acc.candidates.get(newRuntimeHash)!

        acc.candidates.clear()
        return acc
      },
      {
        candidates: new Map<string, Runtime>(),
        current: {} as Runtime,
      },
    ),
    map((x) => x.current),
    distinctUntilChanged(),
  )

  const finalized$: Observable<string> = chainHead$.pipe(
    mergeMap((e) => {
      if (e.type === "initialized") return [e.finalizedBlockHash]
      if (e.type === "finalized") return e.finalizedBlockHashes
      return []
    }),
    shareReplay(1),
  )

  finalized$.subscribe()

  const flattenDescriptors = descriptors.flat()

  const descriptors$ = runtime$.pipe(
    withLatestFrom(finalized$),
    switchMap(([, latestBlock]) =>
      getCodecs$(follower, { storage: flattenDescriptors }, latestBlock).pipe(
        startWith(null),
      ),
    ),
    shareReplay(1),
  )

  descriptors$.subscribe()

  const result = {} as Record<string, Record<string, StorageEntry<any, any>>>

  flattenDescriptors.forEach((d) => {
    const palletEntry = result[d.props.pallet] ?? {}
    result[d.props.pallet] = palletEntry
    palletEntry[d.props.name] = createStorageEntry(
      d,
      descriptors$,
      finalized$,
      () => follower,
    )
  })

  return result as any
}
