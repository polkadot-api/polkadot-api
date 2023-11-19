import type {
  ArgsWithPayloadCodec,
  DescriptorCommon,
  PlainDescriptor,
  StorageDescriptor,
  TxDescriptor,
} from "@polkadot-api/substrate-bindings"
import type { StorageEntry } from "./storage"
import type { TxClient } from "./tx"
import { Observable } from "rxjs"
import { EvClient } from "./events"

export type TupleToIntersection<T extends Array<any>> = T extends [
  infer V,
  ...infer Rest,
]
  ? V & TupleToIntersection<Rest>
  : unknown

type MapStorageDescriptor<A extends Array<StorageDescriptor<any, any>>> = {
  [K in keyof A]: A[K] extends StorageDescriptor<
    DescriptorCommon<infer P, infer N>,
    ArgsWithPayloadCodec<infer Args, infer Payload>
  >
    ? { [K in P]: { [KK in N]: StorageEntry<Args, Payload> } }
    : unknown
}

type MapTxDescriptor<A extends Array<TxDescriptor<any, any>>> = {
  [K in keyof A]: A[K] extends TxDescriptor<
    DescriptorCommon<infer P, infer N>,
    infer Args
  >
    ? {
        [K in P]: {
          [KK in N]: TxClient<TxDescriptor<DescriptorCommon<P, N>, Args>>
        }
      }
    : unknown
}

type MapEvDescriptor<A extends Array<PlainDescriptor<any, any>>> = {
  [K in keyof A]: A[K] extends PlainDescriptor<
    DescriptorCommon<infer P, infer N>,
    infer Codecs
  >
    ? {
        [K in P]: {
          [KK in N]: EvClient<PlainDescriptor<DescriptorCommon<P, N>, Codecs>>
        }
      }
    : unknown
}

type FlattenObjects<T> = T extends {}
  ? {
      [K in keyof T]: T[K] extends {} ? { [KK in keyof T[K]]: T[K][KK] } : T[K]
    }
  : T

export type PullClientStorage<
  Storage extends Array<StorageDescriptor<any, any>>,
  Tx extends Array<TxDescriptor<any, any>>,
  Events extends Array<PlainDescriptor<any, any>>,
> = {
  query: FlattenObjects<TupleToIntersection<MapStorageDescriptor<Storage>>>
  tx: FlattenObjects<TupleToIntersection<MapTxDescriptor<Tx>>>
  event: FlattenObjects<TupleToIntersection<MapEvDescriptor<Events>>>
  finalized: Observable<string>
}
