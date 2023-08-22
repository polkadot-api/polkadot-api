export const DESCRIPTOR_SPEC = `
type Tuple<T> = readonly [T, ...T[]]

export interface DescriptorCommon<Pallet extends string, Name extends string> {
  checksum: bigint
  pallet: Pallet
  name: Name
}

// @ts-ignore
export interface ArgsWithPayloadCodec<Args extends Array<any>, O> {}

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
  Codecs extends Array<any>,
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
    Codecs extends Array<any>,
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
  D extends TxDescriptor<any, infer A, any, any> ? A : []

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
`
