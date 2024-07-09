import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import { getObservableClient } from "@polkadot-api/observable-client"
import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import { Observable, firstValueFrom } from "rxjs"
import { createConstantEntry } from "./constants"
import { ChainDefinition } from "./descriptors"
import { createEventEntry } from "./event"
import { OpType, compatibilityHelper, getRuntimeApi } from "./runtime"
import { createRuntimeCallEntry } from "./runtime-call"
import { createStorageEntry } from "./storage"
import { createTxEntry, submit, submit$ } from "./tx"
import { PolkadotClient, TypedApi } from "./types"

const createTypedApi = <D extends ChainDefinition>(
  chainDefinition: D,
  chainHead: ReturnType<ReturnType<typeof getObservableClient>["chainHead$"]>,
  broadcast$: (tx: string) => Observable<never>,
): TypedApi<D> => {
  const runtime = getRuntimeApi(
    chainDefinition.metadataTypes,
    chainDefinition.descriptors,
    chainHead,
  )

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

  const query = createProxyPath((pallet, name) =>
    createStorageEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(runtime, (r) =>
        r._getPalletEntryPoint(OpType.Storage, pallet, name),
      ),
    ),
  )

  const tx = createProxyPath((pallet, name) =>
    createTxEntry(
      pallet,
      name,
      chainDefinition.asset,
      chainHead,
      broadcast$,
      compatibilityHelper(runtime, (r) =>
        r._getPalletEntryPoint(OpType.Tx, pallet, name),
      ),
    ),
  )

  const event = createProxyPath((pallet, name) =>
    createEventEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(runtime, (r) =>
        r._getPalletEntryPoint(OpType.Event, pallet, name),
      ),
    ),
  )

  const constants = createProxyPath((pallet, name) =>
    createConstantEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(runtime, (r) =>
        r._getPalletEntryPoint(OpType.Const, pallet, name),
      ),
    ),
  )

  const apis = createProxyPath((api, method) =>
    createRuntimeCallEntry(
      api,
      method,
      chainHead,
      compatibilityHelper(runtime, (r) => r._getApiEntryPoint(api, method)),
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

  const { getChainSpecData } = rawClient

  const _request: <Reply = any, Params extends Array<any> = any[]>(
    method: string,
    params: Params,
  ) => Promise<Reply> = rawClient.request

  const { broadcastTx$ } = client
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

    submit: (...args) => submit(chainHead, broadcastTx$, ...args),
    submitAndWatch: (...args) => submit$(chainHead, broadcastTx$, ...args),

    getTypedApi: <D extends ChainDefinition>(chainDefinition: D) =>
      createTypedApi(chainDefinition, chainHead, broadcastTx$),

    destroy: () => {
      chainHead.unfollow()
      client.destroy()
    },

    _request,
  }
}
