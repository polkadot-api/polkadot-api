import { BlockInfo } from "@polkadot-api/observable-client"
import { BlockHeader, HexString } from "@polkadot-api/substrate-bindings"
import { ChainSpecData } from "@polkadot-api/substrate-client"
import { Observable } from "rxjs"
import { CompatibilityToken, RuntimeToken } from "./compatibility"
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
import { StorageEntry, StorageEntryWithKeys } from "./storage"
import type {
  InnerTxEntry,
  OfflineTxEntry,
  TxBroadcastEvent,
  TxFinalizedPayload,
  TxFromBinary,
  UnsafeTxEntry,
} from "./tx"
import { ViewFn } from "./viewFns"

export type { ChainSpecData }

export type StorageApi<
  Unsafe,
  D,
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
          Unsafe,
          D,
          A[K][KK]["KeyArgs"],
          A[K][KK]["KeyArgsOut"],
          A[K][KK]["IsOptional"] extends true
            ? A[K][KK]["Value"] | undefined
            : A[K][KK]["Value"]
        >
      : unknown
  }
}

export type RuntimeCallsApi<
  Unsafe,
  D,
  A extends Record<string, Record<string, any>>,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends { Args: Array<any>; Value: any }
      ? RuntimeCall<Unsafe, D, A[K][KK]["Args"], A[K][KK]["Value"]>
      : unknown
  }
}

export type ViewFnApi<
  Unsafe,
  D,
  A extends Record<string, Record<string, any>>,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends { Args: Array<any>; Value: any }
      ? ViewFn<Unsafe, D, A[K][KK]["Args"], A[K][KK]["Value"]>
      : unknown
  }
}

export type TxApi<
  Unsafe,
  D,
  A extends Record<string, Record<string, any>>,
  Asset,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {} | undefined
      ? InnerTxEntry<Unsafe, D, A[K][KK], K & string, KK & string, Asset>
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

export type EvApi<Unsafe, D, A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: EvClient<Unsafe, D, A[K][KK]>
  }
}

export type ConstApi<
  Unsafe,
  D,
  A extends Record<string, Record<string, any>>,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: ConstantEntry<Unsafe, D, A[K][KK]>
  }
}

export type OfflineConstApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK]
  }
}

export type UnsafeElement<E> = Record<string, Record<string, E>>

type UnsafeEntry<T> = Record<string, Record<string, T>>

export type AnyApi<Unsafe extends true | false, D> = D extends ChainDefinition
  ? {
      query: StorageApi<
        Unsafe,
        D,
        QueryFromPalletsDef<D["descriptors"]["pallets"]>
      >
      tx: TxApi<
        Unsafe,
        D,
        TxFromPalletsDef<D["descriptors"]["pallets"]>,
        D["asset"]["_type"]
      >
      txFromCallData: TxFromBinary<Unsafe, D["asset"]["_type"]>
      event: EvApi<Unsafe, D, EventsFromPalletsDef<D["descriptors"]["pallets"]>>
      apis: RuntimeCallsApi<Unsafe, D, ApisFromDef<D["descriptors"]["apis"]>>
      constants: ConstApi<
        Unsafe,
        D,
        ConstFromPalletsDef<D["descriptors"]["pallets"]>
      >
      view: ViewFnApi<
        Unsafe,
        D,
        ViewFnsFromPalletsDef<D["descriptors"]["pallets"]>
      >
    }
  : {
      query: UnsafeEntry<StorageEntryWithKeys<true, D, any, any, any>>
      tx: UnsafeEntry<UnsafeTxEntry<D, any, string, string, any>>
      txFromCallData: TxFromBinary<Unsafe, any>
      event: UnsafeEntry<EvClient<true, D, any>>
      apis: UnsafeEntry<RuntimeCall<true, D, any, any>>
      constants: UnsafeEntry<ConstantEntry<true, D, any>>
      view: UnsafeEntry<ViewFn<true, D, any, any>>
    }

export type TypedApi<D extends ChainDefinition> = AnyApi<false, D> & {
  compatibilityToken: Promise<CompatibilityToken<D>>
}

export type OfflineApi<D extends ChainDefinition> = {
  constants: OfflineConstApi<ConstFromPalletsDef<D["descriptors"]["pallets"]>>
  tx: OfflineTxApi<
    TxFromPalletsDef<D["descriptors"]["pallets"]>,
    D["asset"]["_type"]
  >
}

export type UnsafeApi<D> = AnyApi<true, D> & {
  runtimeToken: Promise<RuntimeToken<D>>
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
   * @param atBlock  The block-hash of the block.
   * @returns Observable that emits the most modern stable version of the
   *          metadata, and immediately completes.
   */
  getMetadata$: (atBlock: HexString) => Observable<Uint8Array>
  /**
   * Retrieves the most modern stable version of the metadata for a given block.
   *
   * @param atBlock  The block-hash of the block.
   * @returns An abortable Promise that resolves into the most modern
   *          stable version of the metadata.
   */
  getMetadata: (atBlock: HexString, signal?: AbortSignal) => Promise<Uint8Array>

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
   * There is the strong guarantee that for
   * every block emitted its parent has been emitted already in the subscription
   * (except the first block).
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
   * Observable to watch Block Body.
   *
   * @param hash  It can be a block hash, `"finalized"`, or `"best"`
   * @returns Observable to watch a block body. There'll be just one event
   *          with the payload and the observable will complete.
   */
  watchBlockBody: (hash: string) => Observable<HexString[]>
  /**
   * Get Block Body (Promise-based)
   *
   * @param hash  It can be a block hash, `"finalized"`, or `"best"`
   * @returns Block body.
   */
  getBlockBody: (hash: string) => Promise<HexString[]>

  /**
   * Get Block Header (Promise-based)
   *
   * @param hash  It can be a block hash, `"finalized"` (default), or
   *              `"best"`
   * @returns Block hash.
   */
  getBlockHeader: (hash?: string) => Promise<BlockHeader>

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
  getUnsafeApi: <D>() => UnsafeApi<D>

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
