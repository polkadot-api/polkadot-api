import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import {
  ChainHead$,
  getObservableClient,
  withArchive,
} from "@polkadot-api/observable-client"
import { Binary, HexString } from "@polkadot-api/substrate-bindings"
import {
  SubstrateClient,
  createClient as createRawClient,
} from "@polkadot-api/substrate-client"
import {
  Observable,
  catchError,
  defer,
  firstValueFrom,
  from,
  map,
  shareReplay,
} from "rxjs"
import { createConstantEntry } from "./constants"
import { ChainDefinition } from "./descriptors"
import { createEventEntry } from "./event"
import { createRuntimeCallEntry } from "./runtime-call"
import { createStorageEntry } from "./storage"
import { createTxEntry, submit, submit$ } from "./tx"
import type { PolkadotClient, TypedApi } from "./types"
import { createWatchEntries } from "./watch-entries"
import { createViewFnEntry } from "./viewFns"
import { firstValueFromWithSignal, createProxyPath } from "./utils"
import { createCompatHelpers } from "./compatibility"
import { createStaticApis } from "./static-apis"

const HEX_REGEX = /^(?:0x)?((?:[0-9a-fA-F][0-9a-fA-F])+)$/

const createApi = <D extends ChainDefinition>(
  chainHead: ChainHead$,
  broadcast$: (tx: string) => Observable<never>,
  chainDefinition?: ChainDefinition,
): TypedApi<D> => {
  const { getClientCompat, getIsAsssetCompat, getSyncHelpers } =
    createCompatHelpers(chainDefinition)

  const getStaticApis = createStaticApis(
    chainHead.getRuntimeContext$,
    getSyncHelpers,
  )

  const getWatchEntries = createWatchEntries(
    chainHead.pinnedBlocks$,
    chainHead.storage$,
    chainHead.withRuntime,
  )

  const query = createProxyPath((pallet, name) =>
    createStorageEntry(
      pallet,
      name,
      chainHead,
      getWatchEntries,
      getClientCompat("query", pallet, name),
    ),
  )

  const tx = createProxyPath((pallet, name) =>
    createTxEntry(
      pallet,
      name,
      chainHead,
      broadcast$,
      getClientCompat("tx", pallet, name),
      getIsAsssetCompat,
    ),
  )

  const event = createProxyPath((pallet, name) =>
    createEventEntry(
      pallet,
      name,
      chainHead,
      getClientCompat("event", pallet, name),
    ),
  )

  const constants = createProxyPath((pallet, name) =>
    createConstantEntry(
      pallet,
      name,
      chainHead,
      getClientCompat("constants", pallet, name),
    ),
  )

  const apis = createProxyPath((api, method) =>
    createRuntimeCallEntry(
      api,
      method,
      chainHead,
      getClientCompat("apis", api, method),
    ),
  )

  const view = createProxyPath((pallet, entry) =>
    createViewFnEntry(
      pallet,
      entry,
      chainHead,
      getClientCompat("view", pallet, entry),
    ),
  )

  const txFromCallData = (
    callData: Binary,
    { at, signal }: Partial<{ at: string; signal: AbortSignal }> = {},
  ) =>
    firstValueFromWithSignal(
      chainHead.getRuntimeContext$(at ?? null).pipe(
        map(({ dynamicBuilder, lookup }) => {
          try {
            const {
              type: pallet,
              value: { type: name, value: args },
            } = dynamicBuilder
              .buildDefinition(lookup.call!)
              .dec(callData.asBytes())

            return createTxEntry(
              pallet,
              name,
              chainHead,
              broadcast$,
              getClientCompat("tx", pallet, name),
              getIsAsssetCompat,
            )(args)
          } catch {
            throw new Error("createTx: invalid call data")
          }
        }),
      ),
      signal,
    )

  return {
    tx,
    constants,
    apis,
    view,
    query,
    event,
    txFromCallData,
    getStaticApis,
  } as any
}

export type CreateClientOptions = Partial<{
  getMetadata: (codeHash: HexString) => Promise<Uint8Array | null>
  setMetadata: (codeHash: HexString, metadata: Uint8Array) => void
}>

/**
 * This is the top-level export for `polkadot-api`.
 *
 * @param provider  A `JsonRpcProvider` compliant with the [JSON-RPC
 *                  spec](https://paritytech.github.io/json-rpc-interface-spec/),
 *                  which must support the `chainHead`, `transaction` and
 *                  `chainSpec` groups.
 * @param options   - *(Optional)* An object that allows customization of
 *                  metadata handling.
 *                  You can supply functions to retrieve and/or persist the
 *                  metadata associated with runtime `codeHash` values:
 *
 *                  - `getMetadata`: A function that, given a `codeHash` (the
 *                  `:code:` hash),
 *                  returns a `Promise` resolving to a `Uint8Array`
 *                  representing the metadata,
 *                  or `null` if unavailable.
 *                  - `setMetadata`: A function that accepts a `codeHash` and
 *                  its associated `Uint8Array` metadata,
 *                  allowing you to persist the metadata (e.g., in a cache or
 *                  local store).
 * @example
 *
 *   import { getMetadata } from "@polkadot-api/descriptors"
 *   import { createClient } from "polkadot-api"
 *   import { getSmProvider } from "polkadot-api/sm-provider"
 *   import { chainSpec } from "polkadot-api/chains/polkadot"
 *   import { start } from "polkadot-api/smoldot"
 *
 *   const smoldot = start()
 *   const chain = await smoldot.addChain({ chainSpec })
 *
 *   // Connect to the polkadot relay chain.
 *   const client = createClient(getSmProvider(chain), { getMetadata })
 *
 */
export function createClient(
  provider: JsonRpcProvider,
  { getMetadata, setMetadata }: CreateClientOptions = {},
): PolkadotClient {
  const rawClient: SubstrateClient = createRawClient(provider)
  const client = getObservableClient(rawClient, {
    getMetadata: getMetadata
      ? (codeHash: string) => from(getMetadata(codeHash))
      : undefined,
    setMetadata,
  })
  const { getChainSpecData } = rawClient

  const { genesis$, ..._chainHead } = client.chainHead$()
  const archive = client.archive(_chainHead.getRuntime$)
  const chainHead: ChainHead$ = {
    ..._chainHead,
    genesis$: defer(getChainSpecData).pipe(
      map(({ genesisHash }) => genesisHash),
      catchError(() => genesis$),
      shareReplay(1),
    ),
    storage$: withArchive(_chainHead.storage$, archive.storage$),
    body$: withArchive(_chainHead.body$, archive.body$),
    call$: withArchive(_chainHead.call$, archive.call$),
    header$: withArchive(_chainHead.header$, archive.header$),
    eventsAt$: withArchive(_chainHead.eventsAt$, archive.eventsAt$),
    storageQueries$: withArchive(
      _chainHead.storageQueries$,
      archive.storageQueries$,
    ),
    getRuntimeContext$: withArchive(
      _chainHead.getRuntimeContext$,
      archive.getRuntimeContext$,
    ),
  }

  const _request: <Reply = any, Params extends Array<any> = any[]>(
    method: string,
    params: Params,
  ) => Promise<Reply> = rawClient.request

  const { broadcastTx$ } = client

  const getMetadata$ = (at: HexString) =>
    chainHead.getRuntimeContext$(at).pipe(map((ctx) => ctx.metadataRaw))

  const {
    holdBlock,
    finalized$,
    bestBlocks$,
    body$,
    header$,
    storage$,
    unfollow,
  } = chainHead

  const result: PolkadotClient = {
    getChainSpecData,

    getMetadata$,
    getMetadata: (atBlock: HexString, signal?: AbortSignal) =>
      firstValueFromWithSignal(getMetadata$(atBlock), signal),

    blocks$: chainHead.newBlocks$,
    hodlBlock: (block: HexString) => holdBlock(block, true),

    finalizedBlock$: finalized$,
    getFinalizedBlock: () => firstValueFrom(finalized$),

    bestBlocks$: chainHead.bestBlocks$,
    getBestBlocks: () => firstValueFrom(bestBlocks$),

    getBlockBody$: body$,
    getBlockBody: (hash: HexString, signal?: AbortSignal) =>
      firstValueFromWithSignal(body$(hash), signal),

    getBlockHeader$: header$,
    getBlockHeader: (hash: HexString, signal?: AbortSignal) =>
      firstValueFromWithSignal(header$(hash), signal),

    submit: (...args) => submit(chainHead, broadcastTx$, ...args),
    submitAndWatch: (tx) => submit$(chainHead, broadcastTx$, tx),

    getTypedApi: <D extends ChainDefinition>(chainDefinition: D) =>
      createApi(chainHead, broadcastTx$, chainDefinition),
    getUnsafeApi: <D extends ChainDefinition = any>() =>
      createApi<D>(chainHead, broadcastTx$),

    rawQuery: (key, { at, signal } = {}) =>
      firstValueFromWithSignal(
        storage$(at ?? null, "value", () => {
          const hex = key.match(HEX_REGEX)?.[1]
          return hex ? `0x${hex}` : Binary.fromText(key).asHex()
        }),
        signal,
      ),

    destroy: () => {
      unfollow()
      client.destroy()
    },

    _request,
  }

  ;(result as any).___INTERNAL_DO_NOT_USE = chainHead

  return result
}
