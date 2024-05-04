import { Descriptors } from "@polkadot-api/substrate-bindings"
import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import { Observable, firstValueFrom } from "rxjs"
import { ConstantEntry, createConstantEntry } from "./constants"
import { EvClient, createEventEntry } from "./event"
import { BlockInfo, getObservableClient } from "@polkadot-api/observable-client"
import { compatibilityHelper, getRuntimeApi } from "./runtime"
import { RuntimeCall, createRuntimeCallEntry } from "./runtime-call"
import { createStorageEntry, type StorageEntry } from "./storage"
import { TxEntry, createTxEntry, getSubmitFns } from "./tx"
import { HintedSignedExtensions, PolkadotClient, TypedApi } from "./types"
import { getCreateTx } from "./get-create-tx"
import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"

const createTypedApi = <D extends Descriptors>(
  descriptors: D,
  createTxFromSigner: (
    signer: PolkadotSigner,
    callData: Uint8Array,
    atBlock: BlockInfo,
    hinted?: HintedSignedExtensions,
  ) => Observable<Uint8Array>,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  submitFns: ReturnType<typeof getSubmitFns>,
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
        submitFns,
        createTxFromSigner,
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

export function createClient(provider: JsonRpcProvider): PolkadotClient {
  const rawClient: SubstrateClient = createRawClient(provider)
  const client = getObservableClient(rawClient)
  const chainHead = client.chainHead$()

  const createTxFromSigner = getCreateTx(chainHead)
  const submitFns = getSubmitFns(chainHead, client)
  const { submit, submit$: submitAndWatch } = submitFns
  const { getChainSpecData } = rawClient

  const _request: <Reply = any, Params extends Array<any> = any[]>(
    method: string,
    params: Params,
  ) => Promise<Reply> = rawClient.request

  return {
    getChainSpecData,

    finalizedBlock$: chainHead.finalized$,
    getFinalizedBlock: () => firstValueFrom(chainHead.finalized$),

    bestBlocks$: chainHead.bestBlocks$,
    getBestBlocks: () => firstValueFrom(chainHead.bestBlocks$),

    watchBlockBody: chainHead.body$,
    getBlockBody: (hash: string) => firstValueFrom(chainHead.body$(hash)),

    getBlockHeader: (hash?: string) =>
      firstValueFrom(chainHead.header$(hash ?? null)),

    submit,
    submitAndWatch,

    getTypedApi: <D extends Descriptors>(descriptors: D) =>
      createTypedApi(descriptors, createTxFromSigner, chainHead, submitFns),

    destroy: () => {
      chainHead.unfollow()
      client.destroy()
    },

    _request,
  }
}
