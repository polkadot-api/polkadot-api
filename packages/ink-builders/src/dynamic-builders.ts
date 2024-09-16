import { getLookupBuilder } from "@polkadot-api/metadata-builders"
import { Codec, StringRecord, Struct } from "scale-ts"
import { InkMetadataLookup } from "./get-lookup"
import { MessageParamSpec, TypeSpec } from "./metadata-types"

export const getInkDynamicBuilder = (metadataLookup: InkMetadataLookup) => {
  const { metadata } = metadataLookup

  const buildDefinition = getLookupBuilder(metadataLookup)

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
  }
}
