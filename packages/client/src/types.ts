import {
  ArgsWithPayloadCodec,
  DescriptorCommon,
  StorageDescriptor,
} from "@polkadot-api/substrate-bindings"
import { StorageEntry } from "./storage"

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

type Flatten<T> = T extends {}
  ? {
      [K in keyof T]: T[K] extends {} ? { [KK in keyof T[K]]: T[K][KK] } : T[K]
    }
  : T

export type PullClientStorage<A extends Array<StorageDescriptor<any, any>>> =
  Flatten<TupleToIntersection<MapStorageDescriptor<A>>>

/*
function foo<A extends Array<StorageDescriptor<any, any>>>(
  ..._: A
): PullClientStorage<A> {
  return null as any
}

const fooPallet = getPalletCreator("foo")
export const fooStorageS = fooPallet.getStorageDescriptor(1n, "fooNameFirst", {
  len: 2,
} as ArgsWithPayloadCodec<[foo: string, bar: number], boolean>)
export const fooStorageT = fooPallet.getStorageDescriptor(1n, "fooNameSecond", {
  len: 2,
} as ArgsWithPayloadCodec<[foos: string, bas: number], bigint>)

const barPallet = getPalletCreator("bar")
export const barStorageS = barPallet.getStorageDescriptor(1n, "barNameFirst", {
  len: 0,
} as ArgsWithPayloadCodec<[], string>)
export const barStorageT = barPallet.getStorageDescriptor(1n, "barNameSecond", {
  len: 1,
} as ArgsWithPayloadCodec<[sdf: string], number>)

 const test = foo(fooStorageS, fooStorageT, barStorageS, barStorageT)
 test.foo.fooNameFirst.getValue()
*/
