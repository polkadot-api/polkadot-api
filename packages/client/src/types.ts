import {
  Anonymize,
  BlockHeader,
  Descriptors,
  EventsFromDescriptors,
  HexString,
  QueryFromDescriptors,
  RuntimeDescriptor,
  TxFromDescriptors,
} from "@polkadot-api/substrate-bindings"
import { StorageEntry } from "./storage"
import { Transaction } from "./tx"
import { EvClient } from "./event"
import { Observable } from "rxjs"
import { BlockInfo } from "./observableClient"
import { RuntimeApi } from "./runtime"

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

interface JsonRpcProvider {
  send: (message: string) => void
  createTx: CreateTx
  disconnect: () => void
}

export type Connect = (onMessage: (value: string) => void) => JsonRpcProvider

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

type CallOptions = Partial<{
  at: string
  signal: AbortSignal
}>

export type RuntimeCallsApi<
  A extends Record<string, Record<string, RuntimeDescriptor<Array<any>, any>>>,
> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: A[K][KK] extends RuntimeDescriptor<
      infer Args,
      infer Value
    >
      ? (
          ...args: Args["length"] extends 0
            ? [options?: CallOptions]
            : [...args: Anonymize<Args>, options?: CallOptions]
        ) => Promise<Anonymize<Value>>
      : unknown
  }
}

export type TxApi<A extends Record<string, Record<string, any>>, Asset> = {
  [K in keyof A & string]: {
    [KK in keyof A[K] & string]: A[K][KK] extends {} | undefined
      ? (
          ...args: A[K][KK] extends undefined ? [] : [data: A[K][KK]]
        ) => Transaction<A[K][KK], K, KK, Asset>
      : unknown
  }
}

export type EvApi<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: {
    [KK in keyof A[K]]: EvClient<A[K][KK]>
  }
}

export type CreateClient = <T extends Record<string, Descriptors>>(
  connect: Connect,
  descriptors: T,
) => {
  [K in keyof T]: {
    query: StorageApi<QueryFromDescriptors<T[K]>>
    tx: TxApi<TxFromDescriptors<T[K]>, Anonymize<T[K]["asset"]["_type"]>>
    event: EvApi<EventsFromDescriptors<T[K]>>
    apis: RuntimeCallsApi<T[K]["apis"]>
  }
} & {
  finalized$: Observable<BlockInfo>
  bestBlocks$: Observable<BlockInfo[]>
  runtime: RuntimeApi<T>
  getBlockHeader: (hash?: string) => Promise<BlockHeader>
  getBlockBody: (hash: string) => Observable<HexString[]>
  destroy: () => void
}
