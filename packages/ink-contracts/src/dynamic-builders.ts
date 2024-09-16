import { getLookupBuilder } from "@polkadot-api/metadata-builders"
import { Codec, Enum, StringRecord, Struct, Vector } from "scale-ts"
import { InkMetadataLookup } from "./get-lookup"
import { Layout, MessageParamSpec, TypeSpec } from "./metadata-types"

export const getInkDynamicBuilder = (metadataLookup: InkMetadataLookup) => {
  const { metadata } = metadataLookup

  const buildDefinition = getLookupBuilder(metadataLookup)

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

    return Enum(
      Object.fromEntries(
        node.enum.variants.map((variant) => [
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
    args: Array<MessageParamSpec>
    returnType: TypeSpec
  }) => ({
    args: Struct(
      Object.fromEntries(
        callable.args.map((param) => [
          param.label,
          buildDefinition(param.type.type),
        ]),
      ) as StringRecord<Codec<any>>,
    ),
    value: buildDefinition(callable.returnType.type),
  })

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
