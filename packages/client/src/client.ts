import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { BlockInfo, getObservableClient } from "@polkadot-api/observable-client"
import type { PolkadotSigner } from "@polkadot-api/polkadot-signer"
import {
  ApisDescriptors,
  ChainDefinition,
  PalletDescriptors,
} from "./descriptors"
import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import { Observable, firstValueFrom } from "rxjs"
import { createConstantEntry } from "./constants"
import { createEventEntry } from "./event"
import { getCreateTx } from "./get-create-tx"
import { compatibilityHelper, getRuntimeApi } from "./runtime"
import { createRuntimeCallEntry } from "./runtime-call"
import { createStorageEntry } from "./storage"
import { createTxEntry, getSubmitFns } from "./tx"
import { HintedSignedExtensions, PolkadotClient, TypedApi } from "./types"

const createTypedApi = <D extends ChainDefinition>(
  chainDefinition: D,
  createTxFromSigner: (
    signer: PolkadotSigner,
    callData: Uint8Array,
    atBlock: BlockInfo,
    hinted?: HintedSignedExtensions,
  ) => Observable<Uint8Array>,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  submitFns: ReturnType<typeof getSubmitFns>,
): TypedApi<D> => {
  const runtime = getRuntimeApi(chainDefinition.checksums, chainHead)

  const target = {}
  const createProxy = (propCall: (prop: string) => unknown) =>
    new Proxy(target, {
      get(_, prop) {
        return propCall(prop as string)
      },
    })
  const createProxyPath = <T>(pathCall: (a: string, b: string) => T) => {
    const cache: Record<string, Record<string, T>> = {}
    return createProxy((a) => {
      if (!cache[a]) cache[a] = {}
      return createProxy((b) => {
        if (!cache[a][b]) cache[a][b] = pathCall(a, b)
        return cache[a][b]
      })
    }) as Record<string, Record<string, T>>
  }

  const { pallets, apis: runtimeApis } = chainDefinition.descriptors as {
    pallets: PalletDescriptors
    apis: ApisDescriptors
  }
  const query = createProxyPath((pallet, name) =>
    createStorageEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(runtime, pallets[pallet][0][name]),
    ),
  )

  const tx = createProxyPath((pallet, name) =>
    createTxEntry(
      pallet,
      name,
      chainDefinition.asset,
      chainHead,
      submitFns,
      createTxFromSigner,
      compatibilityHelper(runtime, pallets[pallet][1][name]),
    ),
  )

  const event = createProxyPath((pallet, name) =>
    createEventEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(runtime, pallets[pallet][2][name]),
    ),
  )

  const constants = createProxyPath((pallet, name) =>
    createConstantEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(runtime, pallets[pallet][4][name]),
    ),
  )

  const apis = createProxyPath((api, method) =>
    createRuntimeCallEntry(
      api,
      method,
      chainHead,
      compatibilityHelper(runtime, runtimeApis[api][method]),
    ),
  )

  return {
    query,
    tx,
    event,
    apis,
    constants,
    runtime,
  } as any
}

/**
 * This is the top-level export for `polkadot-api`.
 *
 * @param provider  A `JsonRpcProvider` compliant with the [JSON-RPC
 *                  spec](https://paritytech.github.io/json-rpc-interface-spec/),
 *                  which must support the `chainHead`, `transaction` and
 *                  `chainSpec` groups.
 * @example
 *
 *   import { createClient } from "polkadot-api"
 *   import { getSmProvider } from "polkadot-api/sm-provider"
 *   import { chainSpec } from "polkadot-api/chains/polkadot"
 *   import { start } from "polkadot-api/smoldot"
 *
 *   const smoldot = start()
 *   const chain = await smoldot.addChain({ chainSpec })
 *
 *   // Connect to the polkadot relay chain.
 *   const client = createClient(getSmProvider(chain))
 *
 */
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

    getTypedApi: <D extends ChainDefinition>(chainDefinition: D) =>
      createTypedApi(chainDefinition, createTxFromSigner, chainHead, submitFns),

    destroy: () => {
      chainHead.unfollow()
      client.destroy()
    },

    _request,
  }
}
