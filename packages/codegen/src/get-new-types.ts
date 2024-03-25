import {
  getChecksumBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders"
import type { V15 } from "@polkadot-api/substrate-bindings"
import { defaultDeclarations, getTypesBuilder } from "./types-builder"

type ArraVal<T extends Array<any>> = T extends Array<infer V> ? V : unknown

export const getNewTypes = (
  metadata: V15,
  knownTypes: Map<string, string>,
  getTypeName: (data: ArraVal<V15["lookup"]>) => string | null,
) => {
  const checksumBuilder = getChecksumBuilder(metadata)
  let declarations = defaultDeclarations()
  let typesBuilder = getTypesBuilder(declarations, metadata, knownTypes)
  const lookup = getLookupFn(metadata.lookup)

  let ignoredIds = new Set<number>([
    metadata.outerEnums.call,
    metadata.outerEnums.error,
    metadata.outerEnums.event,
  ])

  ;[metadata.outerEnums.call, metadata.outerEnums.event]
    .map(lookup)
    .forEach((entry) => {
      if (entry.type !== "enum") throw null
      Object.values(entry.value).forEach((inner) => {
        if (inner.type === "void") return
        ignoredIds.add(Object.values(inner.value)[0].id)
      })
    })

  const wannabes = new Map<string, string>()
  const nameToChecksum = new Map<string, { path: string[]; checksum: string }>()

  metadata.lookup.forEach((x) => {
    const result = checksumBuilder.buildDefinition(x.id)!
    typesBuilder.buildDefinition(x.id)
    const variable = declarations.variables.get(result)

    if (
      !variable ||
      !variable.type.startsWith("AnonymousEnum<") ||
      wannabes.has(variable.checksum)
    )
      return

    const typeName = getTypeName(x)
    if (!typeName) return

    let finalTypeName = typeName
    for (let i = 1; nameToChecksum.has(finalTypeName); i++)
      finalTypeName = typeName + i

    wannabes.set(variable.checksum, finalTypeName)
    nameToChecksum.set(finalTypeName, {
      checksum: variable.checksum,
      path: x.path,
    })
  })

  declarations = defaultDeclarations()
  typesBuilder = getTypesBuilder(declarations, metadata, wannabes)

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
