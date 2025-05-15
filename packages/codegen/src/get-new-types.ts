import {
  getChecksumBuilder,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import type { V14Lookup } from "@polkadot-api/substrate-bindings"
import { KnownTypes } from "./known-types"
import { defaultDeclarations, getTypesBuilder } from "./types-builder"

export const getNewTypes = (
  lookup: MetadataLookup,
  knownTypes: KnownTypes,
  getTypeName: (data: V14Lookup[number]) => string | null,
) => {
  const { metadata } = lookup
  const checksumBuilder = getChecksumBuilder(lookup)
  let declarations = defaultDeclarations()
  let typesBuilder = getTypesBuilder(
    declarations,
    lookup,
    knownTypes,
    checksumBuilder,
  )

  let ignoredIds = new Set<number>(
    "outerEnums" in metadata
      ? [
          metadata.outerEnums.call,
          metadata.outerEnums.error,
          metadata.outerEnums.event,
        ]
      : [],
  )

  ;("outerEnums" in metadata
    ? [metadata.outerEnums.call, metadata.outerEnums.event]
    : []
  )
    .map(lookup)
    .forEach((entry) => {
      if (entry.type !== "enum") throw null
      Object.values(entry.value).forEach((inner) => {
        if (inner.type === "void") return
        ignoredIds.add(Object.values(inner.value)[0].id)
      })
    })

  const wannabes: KnownTypes = {}
  const nameToChecksum = new Map<string, { path: string[]; checksum: string }>()

  metadata.lookup.forEach((x) => {
    const result = checksumBuilder.buildDefinition(x.id)!
    typesBuilder.buildDefinition(x.id)
    const variable = declarations.variables.get(result)

    if (
      !variable ||
      !variable.type.startsWith("AnonymousEnum<") ||
      variable.checksum in wannabes
    )
      return

    const typeName = getTypeName(x)
    if (!typeName) return

    let finalTypeName = typeName
    for (let i = 1; nameToChecksum.has(finalTypeName); i++)
      finalTypeName = typeName + i

    wannabes[variable.checksum] = { name: finalTypeName, priority: 0 }
    nameToChecksum.set(finalTypeName, {
      checksum: variable.checksum,
      path: x.path,
    })
  })

  declarations = defaultDeclarations()
  typesBuilder = getTypesBuilder(
    declarations,
    lookup,
    wannabes,
    checksumBuilder,
  )

  metadata.lookup.forEach(({ id }) => {
    typesBuilder.buildDefinition(id)
  })

  return Object.fromEntries(
    [...nameToChecksum].map(([name, { checksum, path }]) => {
      return [
        checksum,
        {
          name,
          checksum,
          type: declarations.variables.get(checksum)!.type,
          path,
        },
      ]
    }),
  )
}
