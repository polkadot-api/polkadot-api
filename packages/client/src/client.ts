import { Descriptors } from "@polkadot-api/substrate-bindings"
import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import { firstValueFrom } from "rxjs"
import { ConstantEntry, createConstantEntry } from "./constants"
import { EvClient, createEventEntry } from "./event"
import { getObservableClient } from "./observableClient"
import { compatibilityHelper, getRuntimeApi } from "./runtime"
import { RuntimeCall, createRuntimeCallEntry } from "./runtime-call"
import { createStorageEntry, type StorageEntry } from "./storage"
import { TxEntry, createTxEntry } from "./tx"
import {
  CreateTx,
  HintedSignedExtensions,
  PolkadotClient,
  PolkadotProvider,
  TypedApi,
} from "./types"

const createTypedApi = <D extends Descriptors>(
  descriptors: D,
  createTxFromAddress: (
    address: string | Uint8Array,
    callData: Uint8Array,
  ) => Promise<Uint8Array>,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  client: ReturnType<typeof getObservableClient>,
): TypedApi<D> => {
  const runtimeApi = getRuntimeApi(descriptors.checksums, chainHead)

  const { pallets, apis: runtimeApis } = descriptors
  const query = {} as Record<string, Record<string, StorageEntry<any, any>>>
  for (const pallet in pallets) {
    query[pallet] ||= {}
    const [stgEntries] = pallets[pallet]
    for (const name in stgEntries) {
      query[pallet][name] = createStorageEntry(
        pallet,
        name,
        chainHead,
        compatibilityHelper(runtimeApi, stgEntries[name]),
      )
    }
  }

  const tx = {} as Record<string, Record<string, TxEntry<any, any, any, any>>>
  for (const pallet in pallets) {
    tx[pallet] ||= {}
    const [, txEntries] = pallets[pallet]
    for (const name in txEntries) {
      tx[pallet][name] = createTxEntry(
        pallet,
        name,
        descriptors.asset,
        chainHead,
        client,
        createTxFromAddress,
        compatibilityHelper(runtimeApi, txEntries[name]),
      )
    }
  }

  const events = {} as Record<string, Record<string, EvClient<any>>>
  for (const pallet in pallets) {
    events[pallet] ||= {}
    const [, , evEntries] = pallets[pallet]
    for (const name in evEntries) {
      events[pallet][name] = createEventEntry(
        pallet,
        name,
        chainHead,
        compatibilityHelper(runtimeApi, evEntries[name]),
      )
    }
  }

  const constants = {} as Record<string, Record<string, ConstantEntry<any>>>
  for (const pallet in pallets) {
    constants[pallet] ||= {}
    const [, , , , ctEntries] = pallets[pallet]
    for (const name in ctEntries) {
      constants[pallet][name] = createConstantEntry(
        pallet,
        name,
        chainHead,
        compatibilityHelper(runtimeApi, ctEntries[name]),
      )
    }
  }

  const apis = {} as Record<string, Record<string, RuntimeCall<any, any>>>
  for (const api in runtimeApis) {
    apis[api] ||= {}
    const methods = runtimeApis[api]
    for (const method in methods) {
      apis[api][method] = createRuntimeCallEntry(
        api,
        method,
        chainHead,
        compatibilityHelper(runtimeApi, methods[method]),
      )
    }
  }

  return {
    query: query,
    tx: tx,
    event: events,
    apis,
    constants,
    runtime: runtimeApi,
  } as any
}

export function createClient(
  polkadotProvider: PolkadotProvider,
): PolkadotClient {
  let createTx: CreateTx
  const rawClient: SubstrateClient = createRawClient((onMsg) => {
    const result = polkadotProvider(onMsg)
    createTx = result.createTx
    return result
  })
  const client = getObservableClient(rawClient)
  const chainHead = client.chainHead$()

  const createTxFromAddress = async (
    address: string | Uint8Array,
    callData: Uint8Array,
    hinted?: HintedSignedExtensions,
  ) => {
    let publicKey: Uint8Array

    if (address instanceof Uint8Array) publicKey = address
    else {
      const { accountId } = await firstValueFrom(
        chainHead.getRuntimeContext$(null),
      )
      publicKey = accountId.enc(address)
    }

    return createTx(publicKey, callData, hinted)
  }

  return {
    finalized$: chainHead.finalized$,
    bestBlocks$: chainHead.bestBlocks$,
    getBlockHeader: (hash?: string) =>
      firstValueFrom(chainHead.header$(hash ?? null)),
    getBlockBody: chainHead.body$,
    destroy: () => {
      chainHead.unfollow()
      client.destroy()
    },
    getTypedApi: <D extends Descriptors>(descriptors: D) =>
      createTypedApi(descriptors, createTxFromAddress, chainHead, client),
  }
}
