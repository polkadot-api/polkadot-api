export interface Discriminant<T extends {}> {
  is<K extends keyof T>(
    this: { type: keyof T; value: T[keyof T] },
    type: K,
  ): this is { type: K; value: T[K] }
  as<K extends keyof T>(type: K): T[K]
}

export type Enum<T extends {}> = {
  [K in keyof T & string]: {
    type: K
    value: T[K]
  }
}[keyof T & string] &
  Discriminant<T>

export type EnumVariant<
  T extends { type: string; value?: any },
  K extends T["type"],
> = T & {
  type: K
}

export type ExtractEnumValue<
  T extends { type: string; value?: any },
  K extends string,
> = EnumVariant<T, K>["value"]

type ValueArg<V> = undefined extends V ? [value?: V] : [value: V]

interface EnumFn {
  <T extends { type: string; value: any }, K extends T["type"]>(
    type: K,
    ...[value]: ValueArg<ExtractEnumValue<T, K>>
  ): EnumVariant<T, K>
}
export const Enum: EnumFn = (type, value?) => {
  return {
    type,
    value,
  } as any
}

// type Bar = Enum<{
//   Kaka: 1
//   Bar: 2
// }>

// type FooInput = Enum<{
//   foo: "foo" | undefined
//   bar: Bar
//   baz: number
//   wtf: boolean
// }>

// declare function foo(foo: FooInput): void
// foo(Enum("bar", Enum("Bar", 2)))

// well-known enums
export type GetEnum<T extends Enum<any>> = {
  [K in T["type"]]: (
    ...args: ExtractEnumValue<T, K> extends undefined
      ? []
      : [value: ExtractEnumValue<T, K>]
  ) => EnumVariant<T, K>
}
export const _Enum = new Proxy(
  {},
  {
    get(_, prop: string) {
      return (value: string) => Enum(prop, value)
    },
  },
)
