export type Enum<T extends {}> = {
  [K in keyof T & string]: { type: K; value: T[K] }
}[keyof T & string]

export type ExtractEnumValue<
  T extends { type: string; value?: any },
  K extends string,
> = (T & { type: K })["value"]

export interface Discriminant<T extends Enum<any>> {
  is<K extends T["type"]>(this: T, type: K): this is T & { type: K }
  as<K extends T["type"]>(type: K): ExtractEnumValue<T, K>
}

export type OutputEnum<T extends Enum<any>> = T & Discriminant<T>

type ValueArg<V> = V extends undefined ? [value?: undefined] : [value: V]

export function Enum<
  T extends { type: string; value: any },
  K extends T["type"],
>(type: K, ...[value]: ValueArg<ExtractEnumValue<T, K>>): T & { type: K } {
  return {
    type,
    value,
  } as any
}

// type FooInput = Enum<{
//   foo: "foo"
//   bar: "bar" | undefined
//   baz: number
//   wtf: boolean
// }>

// declare function foo(foo: FooInput): void
// foo(Enum("bar"))

// well-known enums
export type GetEnum<T extends Enum<any>> = {
  [K in T["type"]]: (
    ...args: ExtractEnumValue<T, K> extends undefined
      ? []
      : [value: ExtractEnumValue<T, K>]
  ) => T
}
export const _Enum = new Proxy(
  {},
  {
    get(_, prop: string) {
      return (value: string) => Enum(prop, value)
    },
  },
)
