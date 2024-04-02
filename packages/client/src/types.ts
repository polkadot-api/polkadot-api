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
import { BlockInfo } from "./observableClient"
import { RuntimeApi } from "./runtime"
import { StorageEntry } from "./storage"
import { TxEntry, TxEvents, TxFinalizedPayload } from "./tx"
import { ConstantEntry } from "./constants"
import { RuntimeCall } from "./runtime-call"

export type HintedSignedExtensions = Partial<{
  tip: bigint
  mortality: { mortal: false } | { mortal: true; period: number }
  asset: Uint8Array
}>

export type CreateTx = (
  publicKey: Uint8Array,
  callData: Uint8Array,
  hintedSignedExtensions?: HintedSignedExtensions,
) => Promise<Uint8Array>

export interface PolkadotConnection {
  send: (message: string) => void
  createTx: CreateTx
  disconnect: () => void
}

export type PolkadotProvider = (
  onMessage: (message: string) => void,
) => PolkadotConnection

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
  finalized$: Observable<BlockInfo>
  bestBlocks$: Observable<BlockInfo[]>
  getBlockHeader: (hash?: string) => Promise<BlockHeader>
  getBlockBody: (hash: string) => Observable<HexString[]>
  getTypedApi: <D extends Descriptors>(descriptors: D) => TypedApi<D>
  destroy: () => void
  submit: (transaction: HexString) => Promise<TxFinalizedPayload>
  submitAndWatch: (transaction: HexString) => Observable<TxEvents>
}

export type FixedSizeArray<L extends number, T> = Array<T> & { length: L }
