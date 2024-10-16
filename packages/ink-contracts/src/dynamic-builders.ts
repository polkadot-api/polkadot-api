import { getLookupCodecBuilder } from "@polkadot-api/metadata-builders"
import { Binary, Variant } from "@polkadot-api/substrate-bindings"
import {
  _void,
  Bytes,
  Codec,
  CodecType,
  enhanceCodec,
  StringRecord,
  Struct,
  Tuple,
} from "scale-ts"
import { InkMetadataLookup } from "./get-lookup"
import { MessageParamSpec, TypeSpec } from "./metadata-types"

export const getInkDynamicBuilder = (metadataLookup: InkMetadataLookup) => {
  const { metadata } = metadataLookup

  const buildDefinition = getLookupCodecBuilder(metadataLookup)

  const buildStorage = (name = "") => {
    const storageEntry = metadataLookup.storage[name]
    if (!storageEntry)
      throw new Error(`Storage entry ${name ? name : "{root}"} not found`)

    const keyCodec =
      storageEntry.key == null ? _void : buildDefinition(storageEntry.key)
    return {
      key: prependBytes(keyCodec, storageEntry.keyPrefix),
      value: buildDefinition(storageEntry.typeId),
    }
  }

  const buildCallable = (callable: {
    selector: string
    args: Array<MessageParamSpec>
    returnType: TypeSpec
  }) => {
    const argsCodec = Struct(
      Object.fromEntries(
        callable.args.map((param) => [
          param.label,
          buildDefinition(param.type.type),
        ]),
      ) as StringRecord<Codec<any>>,
    )

    return {
      call: prependBytes(argsCodec, callable.selector),
      value: buildDefinition(callable.returnType.type),
    }
  }

  const buildConstructor = (label: string) => {
    const constr = metadata.spec.constructors.find((c) => c.label === label)
    if (!constr) {
      throw new Error(`Constructor ${label} not found`)
    }

    return buildCallable(constr)
  }

  const buildMessage = (label: string) => {
    const message = metadata.spec.messages.find((c) => c.label === label)
    if (!message) {
      throw new Error(`Message ${label} not found`)
    }

    return buildCallable(message)
  }

  const buildEvent = () =>
    Variant(
      Object.fromEntries(
        metadata.spec.events.map((evt) => [
          evt.label,
          Struct(
            Object.fromEntries(
              evt.args.map((param) => [
                param.label,
                buildDefinition(param.type.type),
              ]),
            ) as StringRecord<Codec<any>>,
          ),
        ]),
      ) as StringRecord<Codec<any>>,
    )

  return {
    buildConstructor,
    buildMessage,
    buildStorage,
    buildEvent,
  }
}

export type InkDynamicBuilder = ReturnType<typeof getInkDynamicBuilder>

const prependBytes = <T>(codec: Codec<T>, hex: string) => {
  const bytes = Binary.fromHex(hex).asBytes()
  const wrappedCodec = Tuple(Bytes(bytes.length), codec)
  return enhanceCodec(
    wrappedCodec,
    (value: CodecType<typeof codec>): CodecType<typeof wrappedCodec> => [
      bytes,
      value,
    ],
    ([, value]) => value,
  )
}
