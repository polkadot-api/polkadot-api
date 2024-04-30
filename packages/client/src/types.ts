import {
  BlockHeader,
  ConstFromDescriptors,
  Descriptors,
  EventsFromDescriptors,
  HexString,
  QueryFromDescriptors,
  RuntimeDescriptor,
  TxFromDescriptors,
} from "@polkadot-api/substrate-bindings"
import { Observable } from "rxjs"
import { EvClient } from "./event"
import { ChainSpecData } from "@polkadot-api/substrate-client"
import { BlockInfo } from "@polkadot-api/observable-client"
import { RuntimeApi } from "./runtime"
import { StorageEntry } from "./storage"
import { TxEntry, TxBroadcastEvent, TxFinalizedPayload } from "./tx"
import { ConstantEntry } from "./constants"
import { RuntimeCall } from "./runtime-call"

export type { ChainSpecData }

export type HintedSignedExtensions = Partial<{
  tip: bigint
  mortality: { mortal: false } | { mortal: true; period: number }
  asset: Uint8Array
}>

export type StorageApi<
  A extends Record<
    string,
    Record<
      string,
      | {
          KeyArgs: Array<any>
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
      Value: any
      IsOptional: false | true
    }
      ? StorageEntry<
          A[K][KK]["KeyArgs"],
          A[K][KK]["IsOptional"] extends true
            ? A[K][KK]["Value"] | undefined
            : A[K][KK]["Value"]
        >
      : unknown
  }
}

export type RuntimeCallsApi<
  A extends Record<string, Record<string, RuntimeDescriptor<Array<any>, any>>>,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends RuntimeDescriptor<
      infer Args,
      infer Value
    >
      ? RuntimeCall<Args, Value>
      : unknown
  }
}

export type TxApi<A extends Record<string, Record<string, any>>, Asset> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends {} | undefined
      ? TxEntry<A[K][KK], K & string, KK & string, Asset>
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

export type TypedApi<D extends Descriptors> = {
  query: StorageApi<QueryFromDescriptors<D>>
  tx: TxApi<TxFromDescriptors<D>, D["asset"]["_type"]>
  event: EvApi<EventsFromDescriptors<D>>
  apis: RuntimeCallsApi<D["apis"]>
  constants: ConstApi<ConstFromDescriptors<D>>
  runtime: RuntimeApi
}

export interface PolkadotClient {
  /**
   * Retrieve the ChainSpecData as it comes from the {@link https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec.html|JSON-RPC spec}
   */
  getChainSpecData: () => Promise<ChainSpecData>

  /**
   * Observable that emits `BlockInfo` from the latest known finalized block. It's a multicast and stateful observable, that will synchronously replay its latest known state.
   */
  finalizedBlock$: Observable<BlockInfo>
  /**
   * @returns Latest known finalized block.
   */
  getFinalizedBlock: () => Promise<BlockInfo>

  /**
   * Observable that emits an Array of `BlockInfo`, being the first element the latest known best block, and the last element the latest known finalized block. It's a multicast and stateful observable, that will synchronously replay its latest known state.
   * This array is an immutable data structure; i.e. a new array is emitted at every event but the reference to its children are stable if the children didn't change.
   *
   * Note that subscribing to this observable already superseedes the need of subscribing to `finalizedBlock$`, since the last element of the array will be the latest known finalized block.
   */
  bestBlocks$: Observable<BlockInfo[]>
  /**
   * @returns Array of `BlockInfo`, being the first element the latest known best block, and the last element the latest known finalized block.
   */
  getBestBlocks: () => Promise<BlockInfo[]>

  /**
   * Observable to watch Block Body
   * @param hash - It can be a block hash, `"finalized"`, or `"best"`
   * @returns Observable to watch a block body. There'll be just one event with the payload and the observable will complete.
   */
  watchBlockBody: (hash: string) => Observable<HexString[]>
  /**
   * Get Block Body (Promise-based)
   * @param hash - It can be a block hash, `"finalized"`, or `"best"`
   * @returns Block body.
   */
  getBlockBody: (hash: string) => Promise<HexString[]>

  /**
   * Get Block Header (Promise-based)
   * @param hash - It can be a block hash, `"finalized"` (default), or `"best"`
   * @returns Block hash.
   */
  getBlockHeader: (hash?: string) => Promise<BlockHeader>

  /**
   * Broadcast a transaction (Promise-based)
   * @param transaction - SCALE-encoded tx to broadcast
   * @param at - It can be a block hash, `"finalized"`, or `"best"`. That block will be used to verify the validity of the tx, retrieve the next nonce, and create the mortality taking that block into account.
   */
  submit: (
    transaction: HexString,
    at?: HexString,
  ) => Promise<TxFinalizedPayload>
  /**
   * Broadcast a transaction and returns an Observable.
   * The observable will complete as soon as the transaction is in a finalized block.
   * @param transaction - SCALE-encoded tx to broadcast
   * @param at - It can be a block hash, `"finalized"`, or `"best"`. That block will be used to verify the validity of the tx, retrieve the next nonce, and create the mortality taking that block into account.
   */
  submitAndWatch: (
    transaction: HexString,
    at?: HexString,
  ) => Observable<TxBroadcastEvent>

  /**
   * Returns an instance of a `TypedApi`
   * @param descriptors - Pass descriptors from `@polkadot-api/descriptors` generated by `papi` CLI
   */
  getTypedApi: <D extends Descriptors>(descriptors: D) => TypedApi<D>

  /*
   * This will `unfollow` the provider, disconnect and error every subscription. After calling it nothing can be done with the client.
   */
  destroy: () => void

  /**
   * This API is meant as an "escape hatch" to allow access to debug endpoitns such
   * as `system_version`, and other useful endpoints that are not spec compliant.
   *
   * @example
   * ```ts
   * const systemVersion = await client._request<string>("system_version", [])
   *
   * const myFancyThhing await client
   *   ._request<{value: string}, [id: number]>('very_fancy', [1714])
   * ```
   */
  _request: <Reply = any, Params extends Array<any> = any[]>(
    method: string,
    params: Params,
  ) => Promise<Reply>
}

export type FixedSizeArray<L extends number, T> = Array<T> & { length: L }
