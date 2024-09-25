import { Binary } from "@polkadot-api/substrate-bindings"
import { InkCallableDescriptor, InkDescriptors } from "./ink-descriptors"
import { getInkLookup, InkMetadataLookup } from "./get-lookup"
import { getInkDynamicBuilder, InkDynamicBuilder } from "./dynamic-builders"

export type InkCallableInterface<T extends InkCallableDescriptor> = <
  L extends string & keyof T,
>(
  label: L,
) => {
  encodeMessage: (value: T[L]["message"]) => Binary
  decodeResponse: (response: Binary) => T[L]["response"]
}

export interface InkStorageInterface<S> {
  rootKey: Binary
  decodeRoot: (rootStorage: Binary) => S
}

export interface InkClient<
  S,
  M extends InkCallableDescriptor,
  C extends InkCallableDescriptor,
> {
  constructor: InkCallableInterface<C>
  message: InkCallableInterface<M>
  storage: InkStorageInterface<S>
}

export const getInkClient = <
  S,
  M extends InkCallableDescriptor,
  C extends InkCallableDescriptor,
>(
  inkContract: InkDescriptors<S, M, C>,
): InkClient<S, M, C> => {
  const lookup = getInkLookup(inkContract.metadata)
  const builder = getInkDynamicBuilder(lookup)

  return {
    constructor: buildCallable(builder.buildConstructor),
    message: buildCallable(builder.buildMessage),
    storage: buildStorage(lookup, builder.buildStorageRoot),
  }
}

const buildCallable =
  <T extends InkCallableDescriptor>(
    builder:
      | InkDynamicBuilder["buildConstructor"]
      | InkDynamicBuilder["buildMessage"],
  ): InkCallableInterface<T> =>
  (label) => {
    const codecs = builder(label)

    return {
      encodeMessage: (value) => Binary.fromBytes(codecs.call.enc(value)),
      decodeResponse: (response) => codecs.value.dec(response.asBytes()),
    }
  }

const buildStorage = <S>(
  lookup: InkMetadataLookup,
  builder: InkDynamicBuilder["buildStorageRoot"],
): InkStorageInterface<S> => ({
  rootKey: Binary.fromHex(lookup.metadata.storage.root.root_key),
  decodeRoot: (rootStorage) => builder().dec(rootStorage.asBytes()),
})
