import { getLookupCodecBuilder } from "@polkadot-api/metadata-builders"
import { Binary, Variant } from "@polkadot-api/substrate-bindings"
import {
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

  const buildStorage = (key = "") => {
    const storageEntry = metadataLookup.storage[key]
    if (!storageEntry)
      throw new Error(`Storage entry ${key ? key : "{root}"} not found`)
    return buildDefinition(storageEntry.typeId)
  }

  const buildCallable = (callable: {
    selector: string
    args: Array<MessageParamSpec>
    returnType: TypeSpec
  }) => {
    const selectorBytes = Binary.fromHex(callable.selector).asBytes()
    const argsCodec = Struct(
      Object.fromEntries(
        callable.args.map((param) => [
          param.label,
          buildDefinition(param.type.type),
        ]),
      ) as StringRecord<Codec<any>>,
    )
    const callCodec = Tuple(Bytes(4), argsCodec)

    return {
      call: enhanceCodec(
        callCodec,
        (value: CodecType<typeof argsCodec>): CodecType<typeof callCodec> => [
          selectorBytes,
          value,
        ],
        ([, value]) => value,
      ),
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
