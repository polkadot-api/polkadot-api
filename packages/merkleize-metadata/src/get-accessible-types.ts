import { UnifiedMetadata } from "@polkadot-api/substrate-bindings"
import { LookupValue } from "./codecs"

export const getAccessibleTypes = (
  metadata: UnifiedMetadata<15 | 16>,
  definitions: Map<number, LookupValue>,
): Map<number, number> => {
  const types = new Set<number>()

  const collectTypesFromId = (id: number) => {
    if (types.has(id)) return

    const { tag, value } = definitions.get(id)!.def
    switch (tag) {
      case "composite":
        if (!value.length) break
        types.add(id)
        value.forEach(({ type }) => {
          collectTypesFromId(type)
        })
        break
      case "variant":
        if (!value.length) break
        types.add(id)
        value.forEach(({ fields }) => {
          fields.forEach(({ type }) => {
            collectTypesFromId(type)
          })
        })
        break
      case "tuple":
        if (!value.length) break
        types.add(id)
        value.forEach(collectTypesFromId)
        break
      case "sequence":
        types.add(id)
        collectTypesFromId(value)
        break
      case "array":
        types.add(id)
        collectTypesFromId(value.type)
        break
      case "bitSequence": // bitSequence inner types are not stored
        types.add(id)
      // primitive and compact are not stored
    }
  }

  collectTypesFromId(metadata.extrinsic.call)
  collectTypesFromId(metadata.extrinsic.address)
  collectTypesFromId(metadata.extrinsic.signature)
  metadata.extrinsic.signedExtensions[0].forEach(
    ({ type, additionalSigned }) => {
      collectTypesFromId(type)
      collectTypesFromId(additionalSigned)
    },
  )

  const sortedTypes = [...types].sort((a, b) => a - b)
  return new Map(sortedTypes.map((value, idx) => [value, idx]))
}
