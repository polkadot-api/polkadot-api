import { SubstrateClient, createClient } from "@polkadot-api/substrate-client"
import {
  Codec,
  Descriptors,
  QueryFromDescriptors,
  V14,
} from "@polkadot-api/substrate-bindings"
import { ScProvider, WellKnownChain } from "@polkadot-api/sc-provider"
import type { PullClientStorage } from "./types"
import { createStorageEntry, type StorageEntry } from "./storage"
import { getObservableClient } from "./observableClient"
import { map } from "rxjs"
import { shareLatest } from "./utils"
import {
  getChecksumBuilder,
  getDynamicBuilder,
} from "@polkadot-api/substrate-codegen"

const getCodecsAndChecksumCreator = (metadata: V14) => {
  const dynamicBuilder = getDynamicBuilder(metadata)
  const checksumBuilder = getChecksumBuilder(metadata)

  const cache: Record<
    string,
    | Record<
        "stg" | "tx" | "ev" | "err" | "cons",
        Record<string, [string | null, any] | undefined> | undefined
      >
    | undefined
  > = {}

  const getCodecsAndChecksum = <
    Type extends "stg" | "tx" | "ev" | "err" | "cons",
  >(
    type: Type,
    pallet: string,
    name: string,
  ): Type extends "stg"
    ? [string | null, ReturnType<typeof dynamicBuilder.buildStorage>]
    : [string | null, Codec<any>] => {
    const cached = cache[pallet]?.[type]?.[name]
    if (cached) return cached

    cache[pallet] ||= { stg: {}, tx: {}, err: {}, ev: {}, cons: {} }
    cache[pallet]![type] ||= {}

    switch (type) {
      case "stg": {
        const checksum = checksumBuilder.buildStorage(pallet, name)
        const codecs = dynamicBuilder.buildStorage(pallet, name)
        cache[pallet]!.stg![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      case "tx": {
        const checksum = checksumBuilder.buildCall(pallet, name)
        const codecs = dynamicBuilder.buildCall(pallet, name)
        cache[pallet]!.tx![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      case "ev": {
        const checksum = checksumBuilder.buildEvent(pallet, name)
        const codecs = dynamicBuilder.buildEvent(pallet, name)
        cache[pallet]!.ev![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      case "err": {
        const checksum = checksumBuilder.buildError(pallet, name)
        const codecs = dynamicBuilder.buildError(pallet, name)
        cache[pallet]!.err![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
      default: {
        const checksum = checksumBuilder.buildConstant(pallet, name)
        const codecs = dynamicBuilder.buildConstant(pallet, name)
        cache[pallet]!.cons![name] = [checksum, codecs]
        return [checksum, codecs] as any
      }
    }
  }

  return getCodecsAndChecksum
}

export function createPullClient<T extends Descriptors>(
  substrateClient: WellKnownChain | string | SubstrateClient,
  descriptors: T,
): PullClientStorage<QueryFromDescriptors<T>> {
  const rawClient: SubstrateClient =
    typeof substrateClient === "string"
      ? createClient(ScProvider(substrateClient))
      : substrateClient
  const client = getObservableClient(rawClient)
  const chainHead = client.chainHead$()

  const codecs$ = chainHead.metadata$.pipe(
    map((value) => (value ? getCodecsAndChecksumCreator(value) : value)),
    shareLatest,
  )
  codecs$.subscribe()

  const result = {} as Record<string, Record<string, StorageEntry<any, any>>>

  for (const pallet in descriptors) {
    result[pallet] ||= {}
    const [stgEntries] = descriptors[pallet]
    for (const name in stgEntries) {
      result[pallet][name] = createStorageEntry(
        stgEntries[name],
        pallet,
        name,
        codecs$,
        chainHead.storage$,
      )
    }
  }

  return result as any
}
