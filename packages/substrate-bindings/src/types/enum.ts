export type Enum<T extends {}> = {
  [K in keyof T & string]: { type: K; value: T[K] }
}[keyof T & string]

export type ExtractEnumValue<
  T extends { type: string; value?: any },
  K extends string,
> = (T & { type: K })["value"]

type ValueArg<V> = undefined extends V ? [value?: V] : [value: V]

interface EnumFn {
  <T extends { type: string; value: any }, K extends T["type"]>(
    type: K,
    ...[value]: ValueArg<ExtractEnumValue<T, K>>
  ): T & { type: K }
}
const enumFn: EnumFn = (type, value?) => {
  return {
    type,
    value,
  } as any
}

interface EnumDiscriminant {
  is<T extends Enum<any>, K extends T["type"]>(
    enumValue: T,
    type: K,
  ): enumValue is T & { type: K }
  as<T extends Enum<any>, K extends T["type"]>(
    enumValue: T,
    type: K,
  ): ExtractEnumValue<T, K>
}
const enumDiscriminant: EnumDiscriminant = {
  as: (enumValue, type) => {
    if (type !== enumValue.type)
      // TODO: fix error
      throw new Error(
        `Enum.as(enum, ${type}) used with actual type ${enumValue.type}`,
      )
    return enumValue.value
  },
  is: ((enumValue: Enum<any>, type: string) =>
    type === enumValue.type) as EnumDiscriminant["is"],
}

export const Enum = Object.assign(enumFn, enumDiscriminant)

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
// foo(enumFn("bar", enumFn("Bar", 2)))

// well-known enums
export type GetEnum<T extends Enum<any>> = {
  [K in T["type"]]: (
    ...args: ExtractEnumValue<T, K> extends undefined
      ? []
      : [value: ExtractEnumValue<T, K>]
  ) => T & { type: K }
}
export const _Enum = new Proxy(
  {},
  {
    get(_, prop: string) {
      return (value: string) => Enum(prop, value)
    },
  },
)
