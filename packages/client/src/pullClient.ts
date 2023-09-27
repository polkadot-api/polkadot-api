import { SubstrateClient, createClient } from "@polkadot-api/substrate-client"
import {
  ArgsWithPayloadCodec,
  DescriptorCommon,
  StorageDescriptor,
} from "@polkadot-api/substrate-bindings"
import { ScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import { map } from "rxjs"
import { shareLatest } from "@/utils"
import { getCodecsFromMetadata } from "./codecs"
import type { PullClientStorage } from "./types"
import { createStorageEntry, type StorageEntry } from "./storage"
import { getObservableClient } from "./observableClient/getObservableClient"

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
  const rawClient: SubstrateClient =
    typeof substrateClient === "string"
      ? createClient(ScProvider(substrateClient))
      : substrateClient
  const client = getObservableClient(rawClient)
  const chainHead = client.chainHead$()

  const flattenDescriptors = descriptors.flat()
  const getCodecs = getCodecsFromMetadata({ storage: flattenDescriptors })

  const descriptors$ = chainHead.metadata$.pipe(
    map((value) => (value ? getCodecs(value) : value)),
    shareLatest,
  )
  descriptors$.subscribe()

  const result = {} as Record<string, Record<string, StorageEntry<any, any>>>

  flattenDescriptors.forEach((d) => {
    const palletEntry = result[d.props.pallet] ?? {}
    result[d.props.pallet] = palletEntry
    palletEntry[d.props.name] = createStorageEntry(
      d,
      descriptors$,
      chainHead.storage$,
    )
  })

  return result as any
}
