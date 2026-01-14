import { BlockInfo } from "@polkadot-api/observable-client"
import { BlockHeader, HexString } from "@polkadot-api/substrate-bindings"
import { ChainSpecData } from "@polkadot-api/substrate-client"
import { Observable } from "rxjs"
import { ConstantEntry } from "./constants"
import {
  ApisFromDef,
  ChainDefinition,
  ConstFromPalletsDef,
  EventsFromPalletsDef,
  QueryFromPalletsDef,
  TxFromPalletsDef,
  ViewFnsFromPalletsDef,
} from "./descriptors"
import { EvClient } from "./event"
import { RuntimeCall } from "./runtime-call"
import { StorageEntry } from "./storage"
import type {
  TxEntry,
  OfflineTxEntry,
  TxBroadcastEvent,
  TxFinalizedPayload,
  TxFromBinary,
} from "./tx"
import { ViewFn } from "./viewFns"
import { ArgsValueCompatHelper, CompatHelper } from "./compatibility"

export type { ChainSpecData }

export type StorageApi<
  A extends Record<
    string,
    Record<
      string,
      | {
          KeyArgs: Array<any>
          KeyArgsOut: Array<any>
          Value: any
          IsOptional: false | true
        }
      | unknown
    >
  >,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {
      KeyArgs: Array<any>
      KeyArgsOut: Array<any>
      Value: any
      IsOptional: false | true
    }
      ? StorageEntry<
          A[K][KK]["KeyArgs"],
          A[K][KK]["KeyArgsOut"],
          A[K][KK]["IsOptional"] extends true
            ? A[K][KK]["Value"] | undefined
            : A[K][KK]["Value"]
        >
      : unknown
  }
}

export type RuntimeCallsApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends { Args: Array<any>; Value: any }
      ? RuntimeCall<A[K][KK]["Args"], A[K][KK]["Value"]>
      : unknown
  }
}

export type ViewFnApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends { Args: Array<any>; Value: any }
      ? ViewFn<A[K][KK]["Args"], A[K][KK]["Value"]>
      : unknown
  }
}

export type TxApi<A extends Record<string, Record<string, any>>, Ext, Asset> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {} | undefined
      ? TxEntry<A[K][KK], K & string, KK & string, Ext, Asset>
      : unknown
  }
}

export type OfflineTxApi<
  A extends Record<string, Record<string, any>>,
  Asset,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {} | undefined
      ? OfflineTxEntry<A[K][KK], K & string, KK & string, Asset>
      : unknown
  }
}

export type EvApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: EvClient<A[K][KK]>
  }
}

export type ConstApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: ConstantEntry<A[K][KK]>
  }
}

export type OfflineConstApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK]
  }
}

export type UnsafeElement<E> = Record<string, Record<string, E>>

export type { CompatHelper, ArgsValueCompatHelper }
export type CompatHelperApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {} | undefined
      ? CompatHelper<A[K][KK]>
      : unknown
  }
}

export type InOutCompatHelperApi<
  A extends Record<string, Record<string, any>>,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends { Args: Array<any>; Value: any }
      ? ArgsValueCompatHelper<A[K][KK]["Args"], A[K][KK]["Value"]>
      : unknown
  }
}

export type QueryCompatHelperApi<
  A extends Record<string, Record<string, any>>,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends { KeyArgs: Array<any>; Value: any }
      ? ArgsValueCompatHelper<A[K][KK]["KeyArgs"], A[K][KK]["Value"]>
      : unknown
  }
}

export type SyncTxApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {} | undefined
      ? { getCallData: (args: A[K][KK]) => Uint8Array }
      : unknown
  }
}

export type SyncQueryApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends { KeyArgs: Array<any>; Value: any }
      ? { getKey: (...args: A[K][KK]["Args"]) => HexString }
      : unknown
  }
}

export type StaticApis<D extends ChainDefinition, Safe> = {
  id: HexString
  decodeCallData: (callData: Uint8Array) => {
    pallet: string
    name: string
    input: any
  }
  constants: ConstFromPalletsDef<D["descriptors"]["pallets"]>
  tx: SyncTxApi<TxFromPalletsDef<D["descriptors"]["pallets"]>>
  compat: Safe extends true
    ? {
        tx: CompatHelperApi<TxFromPalletsDef<D["descriptors"]["pallets"]>>
        constants: CompatHelperApi<
          ConstFromPalletsDef<D["descriptors"]["pallets"]>
        >
        apis: InOutCompatHelperApi<ApisFromDef<D["descriptors"]["apis"]>>
        view: InOutCompatHelperApi<
          ViewFnsFromPalletsDef<D["descriptors"]["pallets"]>
        >
        query: QueryCompatHelperApi<
          QueryFromPalletsDef<D["descriptors"]["pallets"]>
        >
        event: CompatHelperApi<
          EventsFromPalletsDef<D["descriptors"]["pallets"]>
        >
      }
    : unknown
}

export type TypedApi<D extends ChainDefinition, Safe = true> = {
  tx: TxApi<
    TxFromPalletsDef<D["descriptors"]["pallets"]>,
    D["extensions"],
    D["asset"]["_type"]
  >
  constants: ConstApi<ConstFromPalletsDef<D["descriptors"]["pallets"]>>
  apis: RuntimeCallsApi<ApisFromDef<D["descriptors"]["apis"]>>
  view: ViewFnApi<ViewFnsFromPalletsDef<D["descriptors"]["pallets"]>>
  query: StorageApi<QueryFromPalletsDef<D["descriptors"]["pallets"]>>
  event: EvApi<EventsFromPalletsDef<D["descriptors"]["pallets"]>>
  txFromCallData: TxFromBinary<D["asset"]["_type"]>
  getStaticApis: (options?: PullOptions) => Promise<StaticApis<D, Safe>>
}

export type OfflineApi<D extends ChainDefinition> = {
  constants: OfflineConstApi<ConstFromPalletsDef<D["descriptors"]["pallets"]>>
  tx: OfflineTxApi<
    TxFromPalletsDef<D["descriptors"]["pallets"]>,
    D["asset"]["_type"]
  >
}

export type TransactionValidityError<D extends ChainDefinition> =
  (D["descriptors"]["apis"]["TaggedTransactionQueue"]["validate_transaction"][1] & {
    success: false
  })["value"]

export interface PolkadotClient {
  /**
   * Retrieve the ChainSpecData as it comes from the [JSON-RPC
   * spec](https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec.html)
   */
  getChainSpecData: () => Promise<ChainSpecData>

  /**
   * Retrieves the most modern stable version of the metadata for a given block.
   *
   * @param hash  Block hash of the target block.
   * @returns Observable that emits the most modern stable version of the
   *          metadata, and immediately completes.
   */
  getMetadata$: (hash: HexString) => Observable<Uint8Array>
  /**
   * Retrieves the most modern stable version of the metadata for a given block.
   *
   * @param hash    Block hash of the target block.
   * @param signal  Signal to abort promise.
   * @returns An abortable Promise that resolves into the most modern
   *          stable version of the metadata.
   */
  getMetadata: (hash: HexString, signal?: AbortSignal) => Promise<Uint8Array>

  /**
   * Observable that emits `BlockInfo` for every new finalized block. It's a
   * multicast and stateful observable, that will synchronously replay its
   * latest known state.
   */
  finalizedBlock$: Observable<BlockInfo>
  /**
   * @returns Latest known finalized block.
   */
  getFinalizedBlock: () => Promise<BlockInfo>

  /**
   * Observable that emits an Array of `BlockInfo`, being the first element the
   * latest known best block, and the last element the latest known finalized
   * block. It's a multicast and stateful observable, that will synchronously
   * replay its latest known state. This array is an immutable data structure;
   * i.e. a new array is emitted at every event but the reference to its
   * children are stable if the children didn't change.
   *
   * Note that some blocks might not get reported, e.g. if they become finalized
   * immediately without being part of the best block chain.
   */
  bestBlocks$: Observable<BlockInfo[]>
  /**
   * @returns Array of `BlockInfo`, being the first element the latest
   *          known best block, and the last element the latest known
   *          finalized block.
   */
  getBestBlocks: () => Promise<BlockInfo[]>

  /**
   * Observable of new blocks that have been discovered by the client.
   * There is the strong guarantee that for every block emitted its parent has
   * been emitted already in the subscription (except the first block).
   * After subscription, the latest finalized block and all of its known
   * descendants will be emitted synchronously.
   * The Observable will complete if the continuity of the blocks cannot be
   * guaranteed.
   */
  blocks$: Observable<BlockInfo>

  /**
   * Ensures that a block stays available, even after it has been finalized and
   * no operations are running for that block.
   *
   * @returns A callback function to release the block.
   */
  hodlBlock: (blockHash: HexString) => () => void

  /**
   * Get Block Body (Observable-based)
   *
   * @param hash  Block hash of the target block.
   * @returns Observable to get a block body. There'll be just one event
   *          with the payload and the observable will complete.
   */
  getBlockBody$: (hash: HexString) => Observable<Uint8Array[]>
  /**
   * Get Block Body (Promise-based)
   *
   * @param hash    Block hash of the target block.
   * @param signal  Signal to abort promise.
   * @returns Block body.
   */
  getBlockBody: (hash: HexString, signal?: AbortSignal) => Promise<Uint8Array[]>

  /**
   * Get Block Header (Observable-based)
   *
   * @param hash  Block hash of the target block.
   * @returns Observable to get a block header. There'll be just one event
   *          with the payload and the observable will complete.
   */
  getBlockHeader$: (hash: HexString) => Observable<BlockHeader>
  /**
   * Get Block Header (Promise-based)
   *
   * @param hash    Block hash of the target block.
   * @param signal  Signal to abort promise.
   * @returns Block header.
   */
  getBlockHeader: (
    hash: HexString,
    signal?: AbortSignal,
  ) => Promise<BlockHeader>

  /**
   * Broadcasts a transaction (Promise-based). The promise will resolve when the
   * transaction is found in a finalized block; and will reject if the
   * transaction is invalid and can't be broadcasted, or if it is deemed invalid
   * later on.
   *
   * @param transaction  SCALE-encoded tx to broadcast.
   * @param at           It can be a block hash, `"finalized"`, or `"best"`.
   *                     That block will be used to verify the validity of
   *                     the tx.
   */
  submit: (
    transaction: HexString,
    at?: HexString,
  ) => Promise<TxFinalizedPayload>
  /**
   * Broadcasts a transaction and returns an Observable. The observable will
   * complete as soon as the transaction is in a finalized block. See
   * https://papi.how/typed/tx#signsubmitandwatch to learn about all possible
   * events.
   *
   * @param transaction  SCALE-encoded tx to broadcast.
   * @param at           It can be a block hash, `"finalized"`, or `"best"`.
   *                     That block will be used to verify the validity of
   *                     the tx.
   */
  submitAndWatch: (
    transaction: HexString,
    at?: HexString,
  ) => Observable<TxBroadcastEvent>

  /**
   * Returns an instance of a `TypedApi`.
   *
   * @param descriptors  Pass descriptors from `@polkadot-api/descriptors`
   *                     generated by `papi` CLI.
   */
  getTypedApi: <D extends ChainDefinition>(descriptors: D) => TypedApi<D>

  /**
   * Returns an instance of a `UnsafeApi`.
   *
   * Note that this method is only meant for advanced users that really know
   * what are they doing. This API does not provide any runtime compatibility
   * checks protection and the consumer should implement them on their own.
   */
  getUnsafeApi: <D extends ChainDefinition>() => TypedApi<D, false>

  /**
   * Returns a Promise that resolves into the encoded value of a storage entry
   * or `null` if the key doesn't have a corresponding value.
   *
   * @param storageKey  Either one of the well-known substrate storage keys
   *                    or an hexadecimal storage key.
   */
  rawQuery: (
    storageKey: HexString | string,
    options?: PullOptions,
  ) => Promise<HexString | null>

  /**
   * This will `unfollow` the provider, disconnect and error every subscription.
   * After calling it nothing can be done with the client.
   */
  destroy: () => void

  /**
   * This API is meant as an "escape hatch" to allow access to debug endpoints
   * such as `system_version`, and other useful endpoints that are not spec
   * compliant.
   *
   * @example
   *
   *   const systemVersion = await client._request<string>("system_version", [])
   *   const myFancyThhing = await client._request<
   *     { value: string },
   *     [id: number]
   *   >("very_fancy", [1714])
   *
   */
  _request: <Reply = any, Params extends Array<any> = any[]>(
    method: string,
    params: Params,
  ) => Promise<Reply>
}

export type FixedSizeArray<L extends number, T> = Array<T> & { length: L }

export type TxCallData = {
  type: string
  value: {
    type: string
    value: any
  }
}

export type PullOptions = Partial<{
  /**
   * `at` could be a block-hash, `best`, or `finalized` (default)
   */
  at: "best" | "finalized" | ({} & string)
  /**
   * `signal` allows you to abort an ongoing Promise. See [MDN
   * docs](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) for
   * more information
   */
  signal: AbortSignal
}>
