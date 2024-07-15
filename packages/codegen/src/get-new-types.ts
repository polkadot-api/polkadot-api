import {
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"
import type { V14, V15 } from "@polkadot-api/substrate-bindings"
import { KnownTypes } from "./known-types"
import { defaultDeclarations, getTypesBuilder } from "./types-builder"

type ArraVal<T extends Array<any>> = T extends Array<infer V> ? V : unknown

export const getNewTypes = (
  metadata: V14 | V15,
  knownTypes: KnownTypes,
  getTypeName: (data: ArraVal<V15["lookup"]>) => string | null,
) => {
  const lookup = getLookupFn(metadata.lookup)
  const checksumBuilder = getChecksumBuilder(metadata, lookup)
  let declarations = defaultDeclarations()
  let typesBuilder = getTypesBuilder(
    declarations,
    metadata,
    knownTypes,
    checksumBuilder,
    lookup,
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

    wannabes[variable.checksum] = finalTypeName
    nameToChecksum.set(finalTypeName, {
      checksum: variable.checksum,
      path: x.path,
    })
  })

  declarations = defaultDeclarations()
  typesBuilder = getTypesBuilder(
    declarations,
    metadata,
    wannabes,
    checksumBuilder,
    lookup,
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
