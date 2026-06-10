export interface TxChainDefinition {
  extensions: Record<
    string,
    {
      type: unknown
      additionalSigned: unknown
    }
  >
}

export interface TxArgSpec {
  chain: TxChainDefinition
  id: string
  params: object
}
type ApplyArgSpec<
  Spec extends TxArgSpec,
  Chain extends TxChainDefinition,
> = (Spec & { chain: Chain })["params"]

export type ArgsForArgSpecs<
  Specs extends readonly TxArgSpec[],
  Chain extends TxChainDefinition,
> = Simplify<
  UnionToIntersection<
    {
      [I in keyof Specs]: Specs[I] extends TxArgSpec
        ? ApplyArgSpec<Specs[I], Chain>
        : never
    }[number]
  >
>

// Type utils
type Simplify<T> = {
  [K in keyof T]: T[K]
} & {}
type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never
