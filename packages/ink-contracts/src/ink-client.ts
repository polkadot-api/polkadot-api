import { Binary } from "@polkadot-api/substrate-bindings"
import { getInkDynamicBuilder, InkDynamicBuilder } from "./dynamic-builders"
import { getInkLookup } from "./get-lookup"
import {
  Event,
  InkCallableDescriptor,
  InkDescriptors,
  InkStorageDescriptor,
} from "./ink-descriptors"

export type InkCallableInterface<T extends InkCallableDescriptor> = <
  L extends string & keyof T,
>(
  label: L,
) => {
  encode: {} extends T[L]["message"]
    ? (value?: T[L]["message"]) => Binary
    : (value: T[L]["message"]) => Binary
  decode: (value: { data: Binary }) => T[L]["response"]
}

export type InkStorageInterface<S extends InkStorageDescriptor> =
  ("" extends keyof S
    ? () => {
        encode: S[""]["key"] extends undefined
          ? (key?: undefined) => Binary
          : (key: S[""]["key"]) => Binary
        decode: (data: Binary) => S[""]["value"]
      }
    : unknown) &
    (<L extends string & keyof S>(
      label: L,
    ) => {
      encode: S[L]["key"] extends undefined
        ? (key?: undefined) => Binary
        : (key: S[L]["key"]) => Binary
      decode: (data: Binary) => S[L]["value"]
    })

export type GenericEvent =
  | {
      type: "Contracts"
      value:
        | {
            type: "ContractEmitted"
            value: {
              contract: string
              data: Binary
            }
          }
        | { type: string; value: unknown }
    }
  | { type: string; value: unknown }
export interface InkEventInterface<E> {
  decode: (value: { data: Binary }) => E
  filter: (
    address: string,
    events?: Array<GenericEvent | { event: GenericEvent }>,
  ) => E[]
}

export interface InkClient<
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
> {
  constructor: InkCallableInterface<D["__types"]["constructors"]>
  message: InkCallableInterface<D["__types"]["messages"]>
  storage: InkStorageInterface<D["__types"]["storage"]>
  event: InkEventInterface<D["__types"]["event"]>
}

export const getInkClient = <
  D extends InkDescriptors<
    InkStorageDescriptor,
    InkCallableDescriptor,
    InkCallableDescriptor,
    Event
  >,
>(
  inkContract: D,
): InkClient<D> => {
  const lookup = getInkLookup(inkContract.metadata)
  const builder = getInkDynamicBuilder(lookup)

  return {
    constructor: buildCallable(builder.buildConstructor),
    message: buildCallable(builder.buildMessage),
    storage: buildStorage(builder.buildStorage),
    event: buildEvent(builder.buildEvent),
  }
}

const buildCallable =
  <T extends InkCallableDescriptor>(
    builder:
      | InkDynamicBuilder["buildConstructor"]
      | InkDynamicBuilder["buildMessage"],
  ): InkCallableInterface<T> =>
  <L extends string & keyof T>(label: L) => {
    const codecs = builder(label)

    return {
      encode: (value?: T[L]["message"]) =>
        Binary.fromBytes(codecs.call.enc(value || {})),
      decode: (response) => codecs.value.dec(response.data.asBytes()),
    }
  }

const buildStorage =
  <S extends InkStorageDescriptor>(
    builder: InkDynamicBuilder["buildStorage"],
  ): InkStorageInterface<S> =>
  <L extends string & keyof S>(label?: L) => {
    const codecs = builder(label)

    return {
      encode: (key?: S[L]["key"]) =>
        Binary.fromBytes(codecs.key.enc(key as any)),
      decode: (response: Binary) => codecs.value.dec(response.asBytes()),
    }
  }

const buildEvent = <E extends Event>(
  decoder: InkDynamicBuilder["buildEvent"],
): InkEventInterface<E> => {
  const decode: InkEventInterface<E>["decode"] = (value) =>
    decoder().dec(value.data.asBytes()) as E

  return {
    decode,
    filter: (address, events = []) =>
      events
        .map((v) => ("event" in v ? v.event : v))
        .filter(
          (v: any) =>
            v.type === "Contracts" &&
            v.value.type === "ContractEmitted" &&
            v.value.value.contract === address,
        )
        .map((v: any) => {
          try {
            return decode(v.value.value)
          } catch (ex) {
            console.error(
              `Contract ${address} emitted an incompatible event`,
              v.value.value,
            )
            throw ex
          }
        }),
  }
}
