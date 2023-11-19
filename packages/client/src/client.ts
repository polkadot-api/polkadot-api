import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import { createStorageEntry, type StorageEntry } from "./storage"
import { getObservableClient } from "./observableClient"
import { CreateClient } from "./types"
import { getCodecs$ } from "./codecs"

export const createClient: CreateClient = (connect, descriptors) => {
  const rawClient: SubstrateClient = createRawClient(connect)
  const client = getObservableClient(rawClient)
  const chainHead = client.chainHead$()

  const codecs$ = getCodecs$(chainHead.metadata$)
  codecs$.subscribe()

  const query = {} as Record<string, Record<string, StorageEntry<any, any>>>
  for (const pallet in descriptors) {
    query[pallet] ||= {}
    const [stgEntries] = descriptors[pallet]
    for (const name in stgEntries) {
      query[pallet][name] = createStorageEntry(
        stgEntries[name],
        pallet,
        name,
        codecs$,
        chainHead.storage$,
      )
    }
  }

  return { query: query as any }
}
