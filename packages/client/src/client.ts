import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import { createStorageEntry, type StorageEntry } from "./storage"
import { getObservableClient } from "./observableClient"
import { CreateClient, CreateTx } from "./types"
import { getCodecs$ } from "./codecs"
import { TxClient, createTxEntry } from "./tx"
import { filter, firstValueFrom } from "rxjs"
import { EvClient, createEventEntry } from "./event"

export const createClient: CreateClient = (connect, descriptors) => {
  let createTx: CreateTx
  const rawClient: SubstrateClient = createRawClient((onMsg) => {
    const result = connect(onMsg)
    createTx = result.createTx
    return result
  })
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

  const createTxFromAddress = async (address: string, callData: Uint8Array) => {
    const { accountId } = await firstValueFrom(codecs$.pipe(filter(Boolean)))
    return createTx(accountId.enc(address), callData)
  }

  const tx = {} as Record<string, Record<string, TxClient<any>>>
  for (const pallet in descriptors) {
    tx[pallet] ||= {}
    const [, txEntries] = descriptors[pallet]
    for (const name in txEntries) {
      tx[pallet][name] = createTxEntry(
        txEntries[name],
        pallet,
        name,
        codecs$,
        client,
        chainHead.storage$,
        createTxFromAddress,
      )
    }
  }

  const events = {} as Record<string, Record<string, EvClient<any>>>
  for (const pallet in descriptors) {
    events[pallet] ||= {}
    const [, , evEntries] = descriptors[pallet]
    for (const name in evEntries) {
      events[pallet][name] = createEventEntry(
        evEntries[name],
        pallet,
        name,
        codecs$,
        chainHead.finalized$,
        chainHead.storage$,
      )
    }
  }

  return { query: query as any, tx: tx as any, event: events as any }
}
