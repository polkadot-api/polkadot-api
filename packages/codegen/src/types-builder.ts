import {
  ArrayVar,
  getChecksumBuilder,
  MetadataLookup,
  StructVar,
  TupleVar,
} from "@polkadot-api/metadata-builders"
import { getInternalTypesBuilder } from "./internal-types"
import {
  generateTypescript,
  nativeNodeCodegen,
  processPapiPrimitives,
} from "./internal-types/generate-typescript"

export interface Variable {
  name: string

  checksum: string
  type: string
}

export interface CodeDeclarations {
  imports: Set<string>
  // checksum -> Variable;
  // in Mode.Anonymize contains normalized types for every checksum,
  // in Mode.TerminateKnown contains expanded types, with duplication
  variables: Map<string, Variable>
  takenNames: Set<string>
}

export const defaultDeclarations = (): CodeDeclarations => ({
  imports: new Set(),
  variables: new Map(),
  takenNames: new Set(),
})

export const getTypesBuilder = (
  declarations: CodeDeclarations,
  getLookupEntryDef: MetadataLookup,
  // checksum -> desired-name
  knownTypes: Record<string, string>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
) => {
  const { metadata, call } = getLookupEntryDef
  const callsChecksum = call ? checksumBuilder.buildDefinition(call) : null

  const typeFileImports = new Set<string>()
  const clientFileImports = new Set<string>()

  const getChecksum = (id: number | StructVar | TupleVar | ArrayVar): string =>
    typeof id === "number"
      ? checksumBuilder.buildDefinition(id)!
      : checksumBuilder.buildComposite(id)!

  const internalBuilder = getInternalTypesBuilder(getLookupEntryDef)
  const anonymize = (varName: string) => {
    if (!varName.startsWith("I")) return varName
    const checksum = varName.slice(1)
    return knownTypes[checksum] ? varName : `Anonymize<${varName}>`
  }
  const getName = (checksum: string) => {
    if (!knownTypes[checksum]) return `I${checksum}`

    const originalName = knownTypes[checksum]
    let name = originalName
    let i = 1
    while (declarations.takenNames.has(name)) name = originalName + i++

    declarations.takenNames.add(name)
    return name
  }

  const buildDefinition = (id: number) => {
    const node = internalBuilder(id)

    return generateTypescript(node, (node, next): string => {
      // primitives are not assigned to intermediate types
      if (node.type === "primitive") return nativeNodeCodegen(node, next)

      const checksum =
        "id" in node
          ? getChecksum(node.id)
          : // for types inlined in Enums, we might have an intermediate type
            "original" in node
            ? getChecksum(node.original)
            : null

      // We can't call this directly because we might have to prepare the
      // `declarations.variables` if it turns out it's nested;
      const getPapiPrimitive = () => {
        // TODO AnonymousEnum
        const papiPrimitive = processPapiPrimitives(node, next)
        if (papiPrimitive?.import) {
          clientFileImports.add(papiPrimitive.import)
        }
        return papiPrimitive
      }

      if (!checksum) {
        // It's not a lookup type nor an inlined Enum type
        // Return the primitive type or the regular codegen.
        return getPapiPrimitive()?.code ?? nativeNodeCodegen(node, next)
      }

      if (checksum === callsChecksum) {
        clientFileImports.add("TxCallData")
        return "TxCallData"
      }

      if (declarations.variables.has(checksum)) {
        const entry = declarations.variables.get(checksum)!
        typeFileImports.add(entry.name)
        return anonymize(entry.name)
      }

      const variable: Variable = {
        checksum,
        type: "",
        name: getName(checksum),
      }
      declarations.variables.set(checksum, variable)
      variable.type = getPapiPrimitive()?.code ?? nativeNodeCodegen(node, next)

      return variable.name
    })
  }

  const buildTypeDefinition = (id: number) => anonymize(buildDefinition(id))

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        key: "[]",
        val: `${buildTypeDefinition(storageEntry.type.value)}`,
      }

    const { key, value } = storageEntry.type.value
    const val = buildTypeDefinition(value)

    const returnKey =
      storageEntry.type.value.hashers.length === 1
        ? `[Key: ${buildTypeDefinition(key)}]`
        : buildTypeDefinition(key)

    return { key: returnKey, val }
  }

  const buildRuntimeCall = (api: string, method: string) => {
    const entry = metadata.apis
      .find((x) => x.name === api)
      ?.methods.find((x) => x.name === method)
    if (!entry) throw null

    const innerTuple = entry.inputs
      .map(({ name, type }) => `${name}: ${buildTypeDefinition(type)}`)
      .join(", ")

    return {
      args: `[${innerTuple}]`,
      value: buildTypeDefinition(entry.output),
    }
  }

  const buildVariant =
    (type: "errors" | "events" | "calls") => (pallet: string, name: string) => {
      const lookupEntry = getLookupEntryDef(
        metadata.pallets.find((x) => x.name === pallet)![type]! as number,
      )
      if (lookupEntry.type !== "enum") throw null

      // if (getChecksum(lookupEntry.id) !== "ajkhn97prklo5") return ""

      // Generate the type that has all the variants - This is so the consumer can import the type, even if it's not used directly by the descriptor file
      buildDefinition(lookupEntry.id)

      const innerLookup = lookupEntry.value[name]

      if (innerLookup.type === "lookupEntry") {
        return buildTypeDefinition(innerLookup.value.id)
      } else if (innerLookup.type === "void") {
        return "undefined"
      } else {
        // const checksum = getChecksum(innerLookup)
        // console.log("checksum", getChecksum(lookupEntry.id), checksum)
        const result = declarations.variables.get(
          getChecksum(innerLookup),
        )!.name
        typeFileImports.add(result)

        return `Anonymize<${result}>`
      }
    }

  const buildConstant = (pallet: string, constantName: string) => {
    // return ""
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildTypeDefinition(storageEntry.type)
  }

  return {
    buildTypeDefinition,
    buildDefinition,
    buildStorage,
    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildCall: buildVariant("calls"),
    buildRuntimeCall,
    buildConstant,
    getTypeFileImports: () => Array.from(typeFileImports),
    getClientFileImports: () => Array.from(clientFileImports),
  }
}

export const getDocsTypesBuilder = (
  getLookupEntryDef: MetadataLookup,
  knownTypes: Record<string, string>,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
) => {
  const { metadata, call } = getLookupEntryDef
  const callsChecksum = call ? checksumBuilder.buildDefinition(call) : null
  const clientFileImports = new Set<string>()
  const fileTypeEntries = new Set<number>()

  // checksum -> types that are imported for it
  const importsPerType = new Map<string, Set<string>>()

  const declarations = defaultDeclarations()

  const getChecksum = (id: number | StructVar | TupleVar | ArrayVar): string =>
    typeof id === "number"
      ? checksumBuilder.buildDefinition(id)!
      : checksumBuilder.buildComposite(id)!

  const internalBuilder = getInternalTypesBuilder(getLookupEntryDef)
  const buildDefinition = (id: number) => {
    const node = internalBuilder(id)

    const visited = new Set<string>()
    return generateTypescript(node, (innerNode, next): string => {
      const primitive = processPapiPrimitives(innerNode, next)
      if (primitive) {
        primitive.import && clientFileImports.add(primitive.import)
        return primitive.code
      }

      if (!("id" in innerNode)) {
        return next(innerNode)
      }

      const checksum = getChecksum(innerNode.id)!
      if (checksum === callsChecksum) {
        clientFileImports.add("TxCallData")
        return "TxCallData"
      }

      if (declarations.variables.has(checksum)) {
        const entry = declarations.variables.get(checksum)!
        // TODO importsPerType
        return entry.name
      }

      if (checksum in knownTypes) {
        const variable: Variable = {
          checksum,
          type: "",
          name: knownTypes[checksum],
        }
        declarations.variables.set(checksum, variable)
        variable.type = next(innerNode)

        return variable.name
      }

      if (visited.has(checksum)) {
        return "__Circular"
      }
      visited.add(checksum)
      return next(innerNode)
    })
  }

  const buildTypeDefinition = (id: number) => {
    fileTypeEntries.add(id)
    return buildDefinition(id)
  }

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        args: "[]",
        payload: `${buildTypeDefinition(storageEntry.type.value)}`,
      }

    const { key, value } = storageEntry.type.value
    const payload = buildTypeDefinition(value)

    const returnKey =
      storageEntry.type.value.hashers.length === 1
        ? `[Key: ${buildTypeDefinition(key)}]`
        : buildTypeDefinition(key)

    return { args: returnKey, payload }
  }

  const buildRuntimeCall = (api: string, method: string) => {
    const entry = metadata.apis
      .find((x) => x.name === api)
      ?.methods.find((x) => x.name === method)
    if (!entry) throw null

    const innerTuple = entry.inputs
      .map(({ name, type }) => `${name}: ${buildTypeDefinition(type)}`)
      .join(", ")

    return {
      args: `[${innerTuple}]`,
      value: buildTypeDefinition(entry.output),
    }
  }

  const buildVariant =
    (type: "errors" | "events" | "calls") => (pallet: string, name: string) => {
      const lookupEntry = getLookupEntryDef(
        metadata.pallets.find((x) => x.name === pallet)![type]! as number,
      )
      if (lookupEntry.type !== "enum") throw null

      const innerLookup = lookupEntry.value[name]

      if (innerLookup.type === "lookupEntry") {
        return buildTypeDefinition(innerLookup.value.id)
      } else if (innerLookup.type === "void") {
        return "undefined"
      } else {
        // building all variants, in order to populate declarations.variables
        buildTypeDefinition(lookupEntry.id)
        const innerChecksum = getChecksum(innerLookup)
        const innerVariable = declarations.variables.get(innerChecksum)
        if (!innerVariable) {
          throw new Error(
            `Unable to build ${type} variant for ${pallet}::${name}: ${innerChecksum} not populated`,
          )
        }

        return innerVariable.type
      }
    }

  const buildConstant = (pallet: string, constantName: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .constants!.find((s) => s.name === constantName)!

    return buildTypeDefinition(storageEntry.type)
  }

  const recordTypeFileImports = (): string[] => {
    const allImports = new Set<string>()
    for (const id of fileTypeEntries) {
      const thisTypeImports = importsPerType.get(getChecksum(id))
      if (!thisTypeImports) continue

      for (const singleType of thisTypeImports.values()) {
        allImports.add(singleType)
      }
    }
    fileTypeEntries.clear()
    return Array.from(allImports)
  }

  const getDescriptorsTypes = (): Variable[] =>
    [...declarations.variables.entries()]
      .filter(([checksum]) => knownTypes[checksum])
      .map(([_, variable]) => variable)

  return {
    buildStorage,
    buildRuntimeCall,
    buildEvent: buildVariant("events"),
    buildError: buildVariant("errors"),
    buildCall: buildVariant("calls"),
    buildConstant,
    declarations,
    recordTypeFileImports,
    getClientFileImports: () => Array.from(clientFileImports),
    getDescriptorsTypes,
  }
}
