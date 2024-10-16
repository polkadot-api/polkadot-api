import { Binary, FixedSizeBinary } from "@polkadot-api/substrate-bindings"
import { getInkDynamicBuilder, InkDynamicBuilder } from "./dynamic-builders"
import { getInkLookup, InkMetadataLookup } from "./get-lookup"
import {
  Event,
  InkCallableDescriptor,
  InkDescriptors,
  InkStorageDescriptor,
} from "./ink-descriptors"
import { EventSpecV5 } from "./metadata-types"

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
  decode: (value: { data: Binary }, signatureTopic?: string) => E
  filter: (
    address: string,
    events?: Array<{ event: GenericEvent; topics: FixedSizeBinary<number>[] }>,
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
    event:
      Number(lookup.metadata.version) === 4
        ? buildEventV4(builder.buildEvents)
        : buildEventV5(lookup, builder.buildEvent),
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

const buildEventV4 = <E extends Event>(
  eventsDecoder: InkDynamicBuilder["buildEvents"],
): InkEventInterface<E> => {
  const decode: InkEventInterface<E>["decode"] = (value) => {
    return eventsDecoder().dec(value.data.asBytes()) as E
  }
  const filter: InkEventInterface<E>["filter"] = (address, events = []) => {
    const contractEvents = events
      .map((v) => v.event)
      .filter(
        (v: any) =>
          v.type === "Contracts" &&
          v.value.type === "ContractEmitted" &&
          v.value.value.contract === address,
      )
    return contractEvents.map((v: any) => {
      try {
        return decode(v.value.value)
      } catch (ex) {
        console.error(
          `Contract ${address} emitted an incompatible event`,
          v.value.value,
        )
        throw ex
      }
    })
  }
  return { decode, filter }
}

const buildEventV5 = <E extends Event>(
  lookup: InkMetadataLookup,
  eventDecoder: InkDynamicBuilder["buildEvent"],
): InkEventInterface<E> => {
  const metadataEventTopics = new Set(
    lookup.metadata.spec.events
      .map((evt) => (evt as EventSpecV5).signature_topic)
      .filter((v) => v != null),
  )
  const hasAnonymousEvents = lookup.metadata.spec.events.some(
    (evt) => (evt as EventSpecV5).signature_topic == null,
  )

  const decode: InkEventInterface<E>["decode"] = (value, signatureTopic) => {
    if (signatureTopic != null) {
      if (!metadataEventTopics.has(signatureTopic)) {
        throw new Error(`Event with signature topic ${value} not found`)
      }
      return eventDecoder(signatureTopic)!.dec(value.data.asBytes()) as E
    }
    if (!hasAnonymousEvents) {
      throw new Error("Event signature topic required")
    }
    return eventDecoder(undefined)!.dec(value.data.asBytes()) as E
  }
  const filter: InkEventInterface<E>["filter"] = (address, events = []) => {
    const contractEvents = events.filter(
      (v) =>
        v.event.type === "Contracts" &&
        (v.event.value as any).type === "ContractEmitted" &&
        (v.event.value as any).value.contract === address,
    )

    return contractEvents
      .map((v) => {
        const eventTopics = v.topics.map((evt) => evt.asHex())
        const suitableTopic = eventTopics.find((topic) =>
          metadataEventTopics.has(topic),
        )
        try {
          return decode((v.event.value as any).value, suitableTopic)
        } catch (ex) {
          console.error(`Contract ${address} emitted an incompatible event`, {
            event: (v.event.value as any).value.data.asHex(),
            eventTopics,
            metadataEventTopics: [...metadataEventTopics],
            hasAnonymousEvents,
          })
          return null
        }
      })
      .filter((v) => v !== null)
  }

  return {
    decode,
    filter,
  }
}
