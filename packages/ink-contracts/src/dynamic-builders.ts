import { getLookupCodecBuilder } from "@polkadot-api/metadata-builders"
import { Binary } from "@polkadot-api/substrate-bindings"
import {
  Bytes,
  Codec,
  CodecType,
  enhanceCodec,
  Enum,
  Option,
  StringRecord,
  Struct,
  Tuple,
  Vector,
} from "scale-ts"
import { InkMetadataLookup } from "./get-lookup"
import { Layout, MessageParamSpec, TypeSpec } from "./metadata-types"

export const getInkDynamicBuilder = (metadataLookup: InkMetadataLookup) => {
  const { metadata } = metadataLookup

  const buildDefinition = getLookupCodecBuilder(metadataLookup)

  const buildLayout = (node: Layout): Codec<any> => {
    if ("root" in node) {
      return buildLayout(node.root.layout)
    }
    if ("leaf" in node) {
      return buildDefinition(node.leaf.ty)
    }
    if ("hash" in node) {
      throw new Error("HashLayout not implemented")
    }
    if ("array" in node) {
      return Vector(buildLayout(node.array.layout), node.array.len)
    }
    if ("struct" in node) {
      return Struct(
        Object.fromEntries(
          node.struct.fields.map((field) => [
            field.name,
            buildLayout(field.layout),
          ]),
        ) as StringRecord<Codec<any>>,
      )
    }

    const variants = Object.values(node.enum.variants)
    if (
      node.enum.name === "Option" &&
      variants.length === 2 &&
      variants[0].name === "None" &&
      variants[1].name === "Some"
    ) {
      const inner =
        variants[1].fields.length === 1
          ? buildLayout(variants[1].fields[0].layout)
          : Tuple(...variants[1].fields.map((v) => buildLayout(v.layout)))
      return Option(inner)
    }

    return Enum(
      Object.fromEntries(
        Object.values(node.enum.variants).map((variant) => [
          variant.name,
          Struct(
            Object.fromEntries(
              variant.fields.map((field) => [
                field.name,
                buildLayout(field.layout),
              ]),
            ) as StringRecord<Codec<any>>,
          ),
        ]),
      ) as StringRecord<Codec<any>>,
    )
  }
  const buildStorageRoot = () => buildLayout(metadata.storage)

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

  return {
    buildConstructor,
    buildMessage,
    buildStorageRoot,
  }
}
