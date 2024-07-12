import { JsonRpcProvider } from "@polkadot-api/json-rpc-provider"
import {
  getObservableClient,
  RuntimeContext,
} from "@polkadot-api/observable-client"
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
import {
  enumValueEntryPointNode,
  runtimeCallEntryPoint,
  singleValueEntryPoint,
  storageEntryPoint,
  voidEntryPointNode,
} from "@polkadot-api/metadata-compatibility"
import { getLookupFn } from "@polkadot-api/metadata-builders"

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

  const getPallet = (ctx: RuntimeContext, name: string) =>
    ctx.metadata.pallets.find((p) => p.name === name)!
  const query = createProxyPath((pallet, name) =>
    createStorageEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(
        runtime,
        (r) => r._getPalletEntryPoint(OpType.Storage, pallet, name),
        // TODO this is way sub-optimal. Needs some rethought. Specially down below
        (ctx) =>
          storageEntryPoint(
            getPallet(ctx, pallet).storage!.items.find((s) => s.name === name)!,
          ),
      ),
    ),
  )

  const getEnumEntry = (
    ctx: RuntimeContext,
    side: "args" | "values",
    id: number,
    name: string,
  ) => {
    // As part of the refactor, maybe the lookup function could be added to ctx?
    const lookup = getLookupFn(ctx.metadata.lookup)
    const entry = lookup(id)
    if (entry.type !== "enum") throw new Error("Expected enum")

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
        runtime,
        (r) => r._getPalletEntryPoint(OpType.Tx, pallet, name),
        (ctx) => getEnumEntry(ctx, "args", getPallet(ctx, pallet).calls!, name),
      ),
    ),
  )

  const event = createProxyPath((pallet, name) =>
    createEventEntry(
      pallet,
      name,
      chainHead,
      compatibilityHelper(
        runtime,
        (r) => r._getPalletEntryPoint(OpType.Event, pallet, name),
        (ctx) =>
          getEnumEntry(ctx, "values", getPallet(ctx, pallet).events!, name),
      ),
    ),
  )

  const constants = createProxyPath((pallet, name) =>
    createConstantEntry(
      pallet,
      name,
      compatibilityHelper(
        runtime,
        (r) => r._getPalletEntryPoint(OpType.Const, pallet, name),
        (ctx) =>
          singleValueEntryPoint(
            getPallet(ctx, pallet).constants.find((c) => c.name === name)!.type,
          ),
      ),
    ),
  )

  const apis = createProxyPath((api, method) =>
    createRuntimeCallEntry(
      api,
      method,
      chainHead,
      compatibilityHelper(
        runtime,
        (r) => r._getApiEntryPoint(api, method),
        (ctx) =>
          runtimeCallEntryPoint(
            ctx.metadata.apis
              .find((a) => a.name === api)!
              .methods.find((m) => m.name === method)!,
          ),
      ),
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
