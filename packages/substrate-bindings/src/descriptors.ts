type Tuple<T> = readonly [T, ...T[]]

export interface DescriptorCommon<Pallet extends string, Name extends string> {
  checksum: bigint
  pallet: Pallet
  name: Name
}

// @ts-ignore
export interface ArgsWithPayloadCodec<Args extends Array<any>, O> {
  len: Args["length"]
}

export interface ArgsWithoutPayloadCodec<Args extends Array<any>> {
  len: Args["length"]
}

export interface StorageDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs extends ArgsWithPayloadCodec<any, any>,
> {
  type: "storage"
  props: Common
  codecs: Codecs
}

export interface ConstantDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs,
> {
  type: "const"
  props: Common
  codecs: Codecs
}

export interface EventDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs,
> {
  type: "event"
  props: Common
  codecs: Codecs
}

export interface ErrorDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs,
> {
  type: "error"
  props: Common
  codecs: Codecs
}

export interface TxDescriptor<
  Common extends DescriptorCommon<string, string>,
  Codecs extends ArgsWithoutPayloadCodec<any>,
  Events extends Tuple<EventDescriptor<any, any>>,
  Errors extends Tuple<ErrorDescriptor<any, any>>,
> {
  type: "tx"
  props: Common
  codecs: Codecs
  events: Events
  errors: Errors
}

export type Descriptor =
  | ConstantDescriptor<any, any>
  | EventDescriptor<any, any>
  | StorageDescriptor<any, any>
  | ErrorDescriptor<any, any>
  | TxDescriptor<any, any, any, any>

export const createCommonDescriptor = <
  Pallet extends string,
  Name extends string,
>(
  checksum: bigint,
  pallet: Pallet,
  name: Name,
): DescriptorCommon<Pallet, Name> => ({
  checksum,
  pallet,
  name,
})

export const getDescriptorCreator = <
  Type extends "const" | "event" | "error",
  Pallet extends string,
  Name extends string,
  Codecs,
>(
  type: Type,
  checksum: bigint,
  pallet: Pallet,
  name: Name,
  codecs: Codecs,
): Type extends "const"
  ? ConstantDescriptor<DescriptorCommon<Pallet, Name>, Codecs>
  : Type extends "event"
  ? EventDescriptor<DescriptorCommon<Pallet, Name>, Codecs>
  : ErrorDescriptor<DescriptorCommon<Pallet, Name>, Codecs> =>
  ({
    type,
    props: { checksum, pallet, name },
    codecs,
  }) as any

export const getPalletCreator = <Pallet extends string>(pallet: Pallet) => {
  const getPayloadDescriptor = <
    Type extends "const" | "event" | "error",
    Name extends string,
    Codecs,
  >(
    type: Type,
    checksum: bigint,
    name: Name,
    codecs: Codecs,
  ): Type extends "const"
    ? ConstantDescriptor<DescriptorCommon<Pallet, Name>, Codecs>
    : Type extends "event"
    ? EventDescriptor<DescriptorCommon<Pallet, Name>, Codecs>
    : ErrorDescriptor<DescriptorCommon<Pallet, Name>, Codecs> =>
    ({
      type,
      props: { checksum, pallet, name },
      codecs,
    }) as any

  const getStorageDescriptor = <
    Name extends string,
    Codecs extends ArgsWithPayloadCodec<Array<any>, any>,
  >(
    checksum: bigint,
    name: Name,
    codecs: Codecs,
  ): StorageDescriptor<DescriptorCommon<Pallet, Name>, Codecs> => ({
    type: "storage",
    props: { checksum, pallet, name },
    codecs,
  })

  const getTxDescriptor = <
    Name extends string,
    Codecs extends ArgsWithoutPayloadCodec<any>,
    Events extends Tuple<EventDescriptor<any, any>>,
    Errors extends Tuple<ErrorDescriptor<any, any>>,
  >(
    checksum: bigint,
    name: Name,
    events: Events,
    errors: Errors,
    codecs: Codecs,
  ): TxDescriptor<DescriptorCommon<Pallet, Name>, Codecs, Events, Errors> => ({
    type: "tx",
    props: { checksum, pallet, name },
    codecs,
    events,
    errors,
  })

  return {
    getPayloadDescriptor,
    getStorageDescriptor,
    getTxDescriptor,
  }
}

export type EventToObject<
  E extends EventDescriptor<DescriptorCommon<any, string>, any>,
> = E extends EventDescriptor<DescriptorCommon<any, infer K>, infer V>
  ? { type: K; value: V }
  : unknown

export type UnionizeTupleEvents<E extends Array<EventDescriptor<any, any>>> =
  E extends Array<infer Ev>
    ? Ev extends EventDescriptor<any, any>
      ? EventToObject<Ev>
      : unknown
    : unknown

export type TxDescriptorArgs<D extends TxDescriptor<any, any, any, any>> =
  D extends TxDescriptor<any, ArgsWithoutPayloadCodec<infer A>, any, any>
    ? A
    : []

export type TxDescriptorEvents<D extends TxDescriptor<any, any, any, any>> =
  D extends TxDescriptor<any, any, infer E, any> ? E : []

export type TxDescriptorErrors<D extends TxDescriptor<any, any, any, any>> =
  D extends TxDescriptor<any, any, any, infer Errors>
    ? Errors extends Tuple<ErrorDescriptor<any, any>>
      ? {
          [K in keyof Errors]: Errors[K] extends ErrorDescriptor<
            DescriptorCommon<any, infer Type>,
            infer Value
          >
            ? { type: Type; value: Value }
            : unknown
        }[keyof Errors extends number ? keyof Errors : never]
      : []
    : []

export type TxFunction<D extends TxDescriptor<any, any, any, any>> = (
  ...args: TxDescriptorArgs<D>
) => Promise<
  | {
      ok: true
      events: Array<UnionizeTupleEvents<TxDescriptorEvents<D>>>
    }
  | { ok: false; error: TxDescriptorErrors<D> }
>

/* try it out!

const myPalletCreator = getPalletCreator("MyPallet")
const fooEvent = myPalletCreator.getPayloadDescriptor(
  "event",
  0n,
  "foo",
  {} as string,
)
const barEvent = myPalletCreator.getPayloadDescriptor(
  "event",
  0n,
  "bar",
  {} as number,
)
const bazEvent = myPalletCreator.getPayloadDescriptor(
  "event",
  0n,
  "baz",
  {} as boolean,
)

const wrongFoo = myPalletCreator.getPayloadDescriptor(
  "error",
  0n,
  "WTF",
  {} as unknown as void,
)

const unnexpectedBar = myPalletCreator.getPayloadDescriptor(
  "error",
  0n,
  "unnexpectedBar",
  {} as number,
)

const notEnoughBaz = myPalletCreator.getPayloadDescriptor(
  "error",
  0n,
  "notEnoughBaz",
  {} as number,
)

const myTxDescriptor = myPalletCreator.getTxDescriptor(
  1n,
  "myTx",
  [fooEvent, bazEvent, barEvent],
  [unnexpectedBar, notEnoughBaz, wrongFoo],
  {len: 2} as ArgsWithoutPayloadCodec<[name: string, value: number]>,
)

export const myTx: TxFunction<typeof myTxDescriptor> = (() => {}) as any

const result = await myTx("account", 2)

if (result.ok) {
  result.events.find((e) => e.type === "foo" && e.value)
} else {
  if (result.error.type === "unnexpectedBar") {
    let someNumber = 0
    someNumber += result.error.value // notice that through type-inference we know that `value` is a number
    console.log("I knew it", someNumber)
  } else {
    console.log(result.error)
  }
}
*/
