import { getLookupCodecBuilder } from "@polkadot-api/metadata-builders"
import { Binary, Variant } from "@polkadot-api/substrate-bindings"
import {
  _void,
  Bytes,
  Codec,
  CodecType,
  createCodec,
  enhanceCodec,
  StringRecord,
  Struct,
  Tuple,
} from "@polkadot-api/substrate-bindings"
import { InkMetadataLookup } from "./get-lookup"
import {
  EventParamSpec,
  EventSpecV5,
  MessageParamSpec,
  TypeSpec,
} from "./metadata-types"

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

  const buildEventCodec = (event: { args: EventParamSpec[] }) =>
    Struct(
      Object.fromEntries(
        event.args.map((param) => [
          param.label,
          buildDefinition(param.type.type),
        ]),
      ) as StringRecord<Codec<any>>,
    )

  const buildEvent = (signatureTopic: string | undefined) => {
    const events = metadata.spec.events as EventSpecV5[]

    const withType = <T>(codec: Codec<T>, type: string) =>
      enhanceCodec<T, { type: string; value: T }>(
        codec,
        (evt) => evt.value,
        (value) => ({ type, value }),
      )

    if (signatureTopic) {
      const event = events.find((evt) => evt.signature_topic === signatureTopic)
      return event ? withType(buildEventCodec(event), event.label) : null
    }

    const candidates = events.filter(
      (evt) => evt.signature_topic === signatureTopic,
    )
    return candidates.length
      ? first(candidates.map((c) => withType(buildEventCodec(c), c.label)))
      : null
  }

  const buildEvents = () =>
    Variant(
      Object.fromEntries(
        metadata.spec.events.map((evt) => [evt.label, buildEventCodec(evt)]),
      ) as StringRecord<Codec<any>>,
    )

  return {
    buildConstructor,
    buildMessage,
    buildStorage,
    buildEvents,
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

const first = <T>(codecs: Codec<T>[]) =>
  createCodec<T>(
    (x) => {
      for (const codec of codecs) {
        try {
          codec.enc(x)
        } catch (_) {}
      }
      throw new Error("Unable to encode")
    },
    (x) => {
      for (const codec of codecs) {
        try {
          codec.dec(x)
        } catch (_) {}
      }
      throw new Error("Unable to decode")
    },
  )
