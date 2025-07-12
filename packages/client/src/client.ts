import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import {
  enumValueEntryPointNode,
  runtimeCallEntryPoint,
  singleValueEntryPoint,
  storageEntryPoint,
  voidEntryPointNode,
} from "@polkadot-api/metadata-compatibility"
import {
  ChainHead$,
  RuntimeContext,
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
import {
  CompatibilityToken,
  OpType,
  RuntimeToken,
  compatibilityHelper,
  createCompatibilityToken,
  createRuntimeToken,
  getCompatibilityApi,
} from "./compatibility"
import { createConstantEntry } from "./constants"
import { ChainDefinition } from "./descriptors"
import { createEventEntry } from "./event"
import { createRuntimeCallEntry } from "./runtime-call"
import { createStorageEntry } from "./storage"
import { createTxEntry, submit, submit$ } from "./tx"
import type { AnyApi, PolkadotClient } from "./types"
import { createWatchEntries } from "./watch-entries"
import { createViewFnEntry } from "./viewFns"
import { firstValueFromWithSignal } from "./utils"

const createApi = <Unsafe extends true | false, D>(
  compatibilityToken: Promise<CompatibilityToken | RuntimeToken>,
  chainHead: ChainHead$,
  broadcast$: (tx: string) => Observable<never>,
): AnyApi<Unsafe, D> => {
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

  const getPallet = (ctx: RuntimeContext, name: string) =>
    ctx.lookup.metadata.pallets.find((p) => p.name === name)

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
      compatibilityHelper(
        compatibilityToken,
        (r) => r.getEntryPoint(OpType.Storage, pallet, name),
        // TODO this is way sub-optimal. Needs some rethought - maybe a builder for entry points?.
        (ctx) => {
          const item = getPallet(ctx, pallet)?.storage?.items.find(
            (s) => s.name === name,
          )
          return item == null ? null : storageEntryPoint(item)
        },
      ),
    ),
  )

  const getEnumEntry = (
    ctx: RuntimeContext,
    side: "args" | "values",
    id: number | undefined,
    name: string,
  ) => {
    if (id == null) return null
    const entry = ctx.lookup(id)
    if (entry.type !== "enum") throw new Error("Expected enum")

    if (entry.value[name] == null) return null
    const node = enumValueEntryPointNode(entry.value[name])
    return {
      args: side === "args" ? node : voidEntryPointNode,
      values: side === "args" ? voidEntryPointNode : node,
    }
  }
  const tx = createProxyPath((pallet, name) =>
    createTxEntry(
      pallet,
      name,
      chainHead,
      broadcast$,
      compatibilityHelper(
        compatibilityToken,
        (r) => r.getEntryPoint(OpType.Tx, pallet, name),
        (ctx) =>
          getEnumEntry(ctx, "args", getPallet(ctx, pallet)?.calls?.type, name),
      ),
      true,
    ),
  )

  const event = createProxyPath((pallet, name) =>
    createEventEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(
        compatibilityToken,
        (r) => r.getEntryPoint(OpType.Event, pallet, name),
        (ctx) =>
          getEnumEntry(
            ctx,
            "values",
            getPallet(ctx, pallet)?.events?.type,
            name,
          ),
      ),
    ),
  )

  const constants = createProxyPath((pallet, name) =>
    createConstantEntry(
      pallet,
      name,
      compatibilityHelper(
        compatibilityToken,
        (r) => r.getEntryPoint(OpType.Const, pallet, name),
        (ctx) => {
          const item = getPallet(ctx, pallet)?.constants.find(
            (c) => c.name === name,
          )?.type
          return item == null ? null : singleValueEntryPoint(item)
        },
      ),
    ),
  )

  const apis = createProxyPath((api, method) =>
    createRuntimeCallEntry(
      api,
      method,
      chainHead,
      compatibilityHelper(
        compatibilityToken,
        (r) => r.getEntryPoint(OpType.Api, api, method),
        (ctx) =>
          runtimeCallEntryPoint(
            ctx.lookup.metadata.apis
              .find((a) => a.name === api)!
              .methods.find((m) => m.name === method)!,
          ),
      ),
    ),
  )
  const view = createProxyPath((pallet, entry) =>
    createViewFnEntry(
      pallet,
      entry,
      chainHead,
      compatibilityHelper(
        compatibilityToken,
        (r) => r.getEntryPoint(OpType.ViewFns, pallet, entry),
        (ctx) =>
          runtimeCallEntryPoint(
            ctx.lookup.metadata.pallets
              .find((a) => a.name === pallet)!
              .viewFns.find((m) => m.name === entry)!,
          ),
      ),
    ),
  )

  const _callDataTx = (
    callData: Binary,
    token: CompatibilityToken | RuntimeToken,
  ) => {
    const { lookup, dynamicBuilder } = getCompatibilityApi(token).runtime()
    try {
      const decoded = dynamicBuilder
        .buildDefinition(lookup.call!)
        .dec(callData.asBytes())
      const pallet = decoded.type
      const call = decoded.value.type
      const args = decoded.value.value

      return createTxEntry(
        pallet,
        call,
        chainHead,
        broadcast$,
        compatibilityHelper(
          compatibilityToken,
          (r) => r.getEntryPoint(OpType.Tx, pallet, call),
          (ctx) =>
            getEnumEntry(
              ctx,
              "args",
              getPallet(ctx, pallet)?.calls?.type,
              call,
            ),
        ),
        false,
      )(args)
    } catch {
      throw new Error("createTx: invalid call data")
    }
  }

  return {
    query,
    txFromCallData: (
      callData: Binary,
      token?: CompatibilityToken | RuntimeToken,
    ) =>
      token
        ? _callDataTx(callData, token)
        : compatibilityToken.then((t) => _callDataTx(callData, t)),
    tx,
    event,
    apis,
    constants,
    view,
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

  let runtimeToken: Promise<RuntimeToken>
  const compatibilityToken = new WeakMap<
    ChainDefinition,
    Promise<CompatibilityToken<any>>
  >()
  const getChainToken = (chainDefinition: ChainDefinition) => {
    const result =
      compatibilityToken.get(chainDefinition) ||
      createCompatibilityToken(chainDefinition, chainHead)
    compatibilityToken.set(chainDefinition, result)
    return result
  }
  const getRuntimeToken = <D>(): Promise<RuntimeToken<D>> =>
    (runtimeToken ??= createRuntimeToken(chainHead))
  const { broadcastTx$ } = client

  return {
    getChainSpecData,

    blocks$: chainHead.newBlocks$,

    finalizedBlock$: chainHead.finalized$,
    getFinalizedBlock: () => firstValueFrom(chainHead.finalized$),

    bestBlocks$: chainHead.bestBlocks$,
    getBestBlocks: () => firstValueFrom(chainHead.bestBlocks$),

    watchBlockBody: chainHead.body$,
    getBlockBody: (hash: string) => firstValueFrom(chainHead.body$(hash)),

    getBlockHeader: (hash?: string) =>
      firstValueFrom(chainHead.header$(hash ?? null)),

    submit: (...args) => submit(chainHead, broadcastTx$, ...args),
    submitAndWatch: (tx) => submit$(chainHead, broadcastTx$, tx),

    getTypedApi: <D extends ChainDefinition>(chainDefinition: D) => {
      const token = getChainToken(chainDefinition)
      return Object.assign(
        createApi<false, D>(token, chainHead, broadcastTx$),
        { compatibilityToken: token },
      )
    },

    getUnsafeApi: <D>() => {
      const token = getRuntimeToken()
      return Object.assign(createApi<true, D>(token, chainHead, broadcastTx$), {
        runtimeToken: token,
      })
    },

    rawQuery: (key, { at, signal } = {}) =>
      firstValueFromWithSignal(
        chainHead.storage$(at ?? null, "value", () =>
          key.match(/0x[0-9a-fA-F]+/) ? key : Binary.fromText(key).asHex(),
        ),
        signal,
      ),

    destroy: () => {
      chainHead.unfollow()
      client.destroy()
    },

    _request,
  }
}
