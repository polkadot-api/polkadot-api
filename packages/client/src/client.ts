import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import { createStorageEntry, type StorageEntry } from "./storage"
import { getObservableClient } from "./observableClient"
import {
  CreateClient,
  CreateTx,
  EvApi,
  RuntimeCallsApi,
  StorageApi,
  TxApi,
} from "./types"
import { Transaction, createTxEntry } from "./tx"
import { firstValueFrom } from "rxjs"
import { EvClient, createEventEntry } from "./event"
import {
  Descriptors,
  EventsFromDescriptors,
  QueryFromDescriptors,
  TxFromDescriptors,
} from "@polkadot-api/substrate-bindings"
import { mapObject } from "@polkadot-api/utils"
import { getRuntimeApi } from "./runtime"
import { RuntimeCall, createRuntimeCallEntry } from "./runtime-call"

const createNamespace = (
  descriptors: Descriptors,
  createTxFromAddress: (
    address: string | Uint8Array,
    callData: Uint8Array,
  ) => Promise<Uint8Array>,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  client: ReturnType<typeof getObservableClient>,
): {
  query: StorageApi<QueryFromDescriptors<Descriptors>>
  tx: TxApi<TxFromDescriptors<Descriptors>>
  event: EvApi<EventsFromDescriptors<Descriptors>>
  apis: RuntimeCallsApi<Descriptors["apis"]>
} => {
  const { pallets, apis: runtimeApis } = descriptors
  const query = {} as Record<string, Record<string, StorageEntry<any, any>>>
  for (const pallet in pallets) {
    query[pallet] ||= {}
    const [stgEntries] = pallets[pallet]
    for (const name in stgEntries) {
      query[pallet][name] = createStorageEntry(
        stgEntries[name],
        pallet,
        name,
        chainHead,
      )
    }
  }

  const tx = {} as Record<
    string,
    Record<string, (a: any) => Transaction<any, any, any>>
  >
  for (const pallet in pallets) {
    tx[pallet] ||= {}
    const [, txEntries] = pallets[pallet]
    for (const name in txEntries) {
      tx[pallet][name] = createTxEntry(
        txEntries[name],
        pallet,
        name,
        chainHead,
        client,
        createTxFromAddress,
      )
    }
  }

  const events = {} as Record<string, Record<string, EvClient<any>>>
  for (const pallet in pallets) {
    events[pallet] ||= {}
    const [, , evEntries] = pallets[pallet]
    for (const name in evEntries) {
      events[pallet][name] = createEventEntry(
        evEntries[name],
        pallet,
        name,
        chainHead,
      )
    }
  }

  const apis = {} as Record<string, Record<string, RuntimeCall<any, any>>>
  for (const api in runtimeApis) {
    apis[api] ||= {}
    const methods = runtimeApis[api]
    for (const method in methods) {
      apis[api][method] = createRuntimeCallEntry(
        methods[method],
        api,
        method,
        chainHead,
      )
    }
  }

  return {
    query: query as any,
    tx: tx,
    event: events,
    apis,
  }
}

export const createClient: CreateClient = (connect, descriptors) => {
  let createTx: CreateTx
  const rawClient: SubstrateClient = createRawClient((onMsg) => {
    const result = connect(onMsg)
    createTx = result.createTx
    return result
  })
  const client = getObservableClient(rawClient)
  const chainHead = client.chainHead$()

  const createTxFromAddress = async (
    address: string | Uint8Array,
    callData: Uint8Array,
  ) => {
    let publicKey: Uint8Array

    if (address instanceof Uint8Array) publicKey = address
    else {
      const { accountId } = await firstValueFrom(
        chainHead.getRuntimeContext$(null),
      )
      publicKey = accountId.enc(address)
    }

    return createTx(publicKey, callData)
  }

  return {
    finalized$: chainHead.finalized$,
    bestBlocks$: chainHead.bestBlocks$,
    runtime: getRuntimeApi(descriptors, chainHead),
    ...mapObject(descriptors, (des) =>
      createNamespace(des, createTxFromAddress, chainHead, client),
    ),
    getBlockHeader: (hash?: string) =>
      firstValueFrom(chainHead.header$(hash ?? null)),
    getBlockBody: chainHead.body$,
    destroy: () => {
      chainHead.unfollow()
      client.destroy()
    },
  } as any
}
