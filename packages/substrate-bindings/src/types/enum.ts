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
    as(_type: string) {
      if (type !== _type)
        // TODO: fix error
        throw new Error(`Enum.as(${_type}) used with actual type ${type}`)
      return value
    },
    is(_type: string) {
      return type === _type
    },
  } as any
}

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

// const InputEnum: GetEnum<FooInput> = null as any;
// InputEnum.bar(Enum('Bar', 2))
