import type { InkStorageDescriptor } from "@polkadot-api/ink-contracts"

export type SdkStorage<S extends InkStorageDescriptor> =
  // NestedStorage<S> &
  RootStorage<S>

type NestedStorage<S extends InkStorageDescriptor> =
  Exclude<keyof S, ""> extends never
    ? {}
    : {
        getNested<L extends string & Exclude<keyof S, "">>(
          label: L,
          ...args: S[L]["key"] extends undefined ? [] : [key: S[L]["key"]]
        ): Promise<S[L]["value"]>
      }

type RootStorage<S extends InkStorageDescriptor> = "" extends keyof S
  ? {
      getRoot(): Promise<S[""]["value"] & UnNest<Omit<S, "">>>
    }
  : {}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

type BuildNested<K extends string, V> = K extends `${infer P}.${infer Rest}`
  ? { [Key in P]: BuildNested<Rest, V> }
  : K extends ""
    ? V
    : {
        [Key in K]: V
      }

type UnNest<S extends InkStorageDescriptor> = UnionToIntersection<
  {
    [K in string & keyof S]: BuildNested<
      K,
      (
        ...args: S[K]["key"] extends undefined ? [] : [key: S[K]["key"]]
      ) => Promise<S[K]["value"]>
    >
  }[string & keyof S]
>
