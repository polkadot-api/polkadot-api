import { Binary } from "@polkadot-api/substrate-bindings"
import { InkCallableDescriptor, InkDescriptors, Event } from "./ink-descriptors"
import { getInkLookup, InkMetadataLookup } from "./get-lookup"
import { getInkDynamicBuilder, InkDynamicBuilder } from "./dynamic-builders"

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

export interface InkStorageInterface<S> {
  rootKey: Binary
  decodeRoot: (rootStorage: Binary) => S
}

export type GenericEvent = {
  event:
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
}
export interface InkEventInterface<E> {
  decode: (value: { data: Binary }) => E
  filter: (address: string, events?: Array<GenericEvent>) => E[]
}

export interface InkClient<
  D extends InkDescriptors<
    unknown,
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
    unknown,
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
    storage: buildStorage(lookup, builder.buildStorageRoot),
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

const buildStorage = <S>(
  lookup: InkMetadataLookup,
  builder: InkDynamicBuilder["buildStorageRoot"],
): InkStorageInterface<S> => {
  const { metadata } = lookup
  const metadataRootKey = Binary.fromHex(metadata.storage.root.root_key)
  // On version 4-, the keys in the storage were in big-endian.
  // For version 5+, the keys in storage are in scale, which is little-endian.
  // https://use.ink/faq/migrating-from-ink-4-to-5#metadata-storage-keys-encoding-change
  // https://github.com/use-ink/ink/pull/2048
  const rootKey =
    Number(metadata.version) === 4
      ? Binary.fromBytes(metadataRootKey.asBytes().reverse())
      : metadataRootKey
  return {
    rootKey,
    decodeRoot: (rootStorage) => builder().dec(rootStorage.asBytes()),
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
        .filter(
          (v: any) =>
            v.event.type === "Contracts" &&
            v.event.value.type === "ContractEmitted" &&
            v.event.value.value.contract === address,
        )
        .map((v: any) => {
          try {
            return decode(v.event.value.value)
          } catch (ex) {
            console.error(
              `Contract ${address} emitted an incompatible event`,
              v.event.value.value,
            )
            throw ex
          }
        }),
  }
}
