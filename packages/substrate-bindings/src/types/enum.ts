export type Enum<T extends {}> = {
  [K in keyof T & string]: {
    type: K
    value: T[K]
  }
}[keyof T & string]

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

interface Discriminant {
  is<T extends { type: string; value: any }, K extends T["type"]>(
    value: T,
    type: K,
  ): value is T & { type: K }
  as<T extends { type: string; value: any }, K extends T["type"]>(
    value: T,
    type: K,
  ): ExtractEnumValue<T, K>
}
const discriminant: Discriminant = {
  is<T extends { type: string; value: any }, K extends T["type"]>(
    value: T,
    type: K,
  ): value is T & { type: K } {
    return value.type === type
  },
  as(value, type) {
    if (type !== value.type)
      throw new Error(
        `Enum.as(enum, ${type}) used with actual type ${value.type}`,
      )
    return value
  },
}
interface EnumFn extends Discriminant {
  <T extends { type: string; value: any }, K extends T["type"]>(
    type: K,
    ...[value]: ValueArg<ExtractEnumValue<T, K>>
  ): EnumVariant<T, K>
}
export const Enum: EnumFn = Object.assign((type: string, value?: any) => {
  return {
    type,
    value,
  } as any
}, discriminant)

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
