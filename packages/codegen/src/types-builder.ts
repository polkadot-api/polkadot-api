import {
  ArrayVar,
  getChecksumBuilder,
  MetadataLookup,
  StructVar,
  TupleVar,
} from "@polkadot-api/metadata-builders"
import { getInternalTypesBuilder, isPrimitive } from "./internal-types"
import {
  CodegenOutput,
  generateTypescript,
  mergeImports,
  nativeNodeCodegen,
  onlyCode,
  processPapiPrimitives,
} from "./internal-types/generate-typescript"
import type { KnownTypes } from "./known-types"

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

const NEVER_STR = "never"
const opaqueHashers = new Set<string>([
  "Blake2128",
  "Blake2256",
  "Twox128",
  "Twox256",
])

export const getTypesBuilder = (
  declarations: CodeDeclarations,
  getLookupEntryDef: MetadataLookup,
  // checksum -> desired-name
  knownTypes: KnownTypes,
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
  const anonymize = ({ name, checksum }: Variable) =>
    knownTypes[checksum] ? name : `Anonymize<${name}>`
  const getName = (checksum: string) => {
    if (!knownTypes[checksum]) return `I${checksum}`

    const { name: originalName } = knownTypes[checksum]
    let name = originalName
    let i = 1
    while (declarations.takenNames.has(name)) name = originalName + i++

    declarations.takenNames.add(name)
    return name
  }

  const buildDefinition = (id: number) => {
    const node = internalBuilder(id)

    return generateTypescript(node, (node, next, level) => {
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
      const getPapiPrimitive = (level: number) => {
        const papiPrimitive = processPapiPrimitives(
          node,
          next,
          !!checksum && !!knownTypes[checksum],
        )
        if (!papiPrimitive) return null
        papiPrimitive.imports.client?.forEach((name) => {
          if (level === 0) {
            clientFileImports.add(name)
          } else {
            declarations.imports.add(name)
          }
        })
        return onlyCode(papiPrimitive.code)
      }

      if (!checksum || isPrimitive(node) || node.type === "union") {
        // It's not a lookup type nor an inlined Enum type
        // Return the primitive type or the regular codegen.
        // And if it's a chainPrimitive also return that primitive without creating
        // and intermediate type.
        return getPapiPrimitive(level) ?? nativeNodeCodegen(node, next)
      }

      if (level > 0 && checksum === callsChecksum) {
        declarations.imports.add("TxCallData")
        return onlyCode("TxCallData")
      }

      if (declarations.variables.has(checksum)) {
        const entry = declarations.variables.get(checksum)!
        if (level === 0) {
          typeFileImports.add(entry.name)
        }
        return onlyCode(anonymize(entry))
      }

      const variable: Variable = {
        checksum,
        type: "",
        name: getName(checksum),
      }
      if (level === 0) {
        typeFileImports.add(variable.name)
      }
      declarations.variables.set(checksum, variable)
      // We're wrapping the variable with another, so we increase a level.
      variable.type = (
        getPapiPrimitive(level + 1) ?? nativeNodeCodegen(node, next)
      ).code

      return onlyCode(anonymize(variable))
    })
  }

  const buildTypeDefinition = (id: number) => buildDefinition(id).code

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        key: "[]",
        val: `${buildTypeDefinition(storageEntry.type.value)}`,
        opaque: NEVER_STR,
      }

    const hashers = storageEntry.type.value.hashers
    const opaque =
      hashers
        .map((x, idx) => (opaqueHashers.has(x.tag) ? `"${idx}"` : null))
        .filter(Boolean)
        .join(" | ") || NEVER_STR

    const { key, value } = storageEntry.type.value
    const val = buildTypeDefinition(value)

    const returnKey =
      storageEntry.type.value.hashers.length === 1
        ? `[Key: ${buildTypeDefinition(key)}]`
        : buildTypeDefinition(key)

    return { key: returnKey, val, opaque }
  }

  const buildViewFn = (pallet: string, entry: string) => {
    const viewFn = metadata.pallets
      .find((x) => x.name === pallet)
      ?.viewFns.find((x) => x.name === entry)
    if (!viewFn) throw null

    const innerTuple = viewFn.inputs
      .map(({ name, type }) => `${name}: ${buildTypeDefinition(type)}`)
      .join(", ")

    return {
      args: `[${innerTuple}]`,
      value: buildTypeDefinition(viewFn.output),
    }
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
        metadata.pallets.find((x) => x.name === pallet)![type]!.type,
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
      } else if (type === "calls") {
        if (innerLookup.type !== "struct") {
          console.log(innerLookup)
          throw new Error("Unexpected innerLookup")
        }
        return `[${Object.entries(innerLookup.value)
          .map(([key, value]) => {
            const def = buildDefinition(value.id)
            const variable = declarations.variables.get(
              getChecksum(value.id),
            )?.name
            if (variable) {
              typeFileImports.add(variable)
            }
            const sanitisedKey = reservedJS.includes(key) ? `${key}_` : key
            return `${sanitisedKey}: ${variable ? `Anonymize<${variable}>` : def.code}`
          })
          .join(", ")}]`
      } else {
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
    buildViewFn,
    buildRuntimeCall,
    buildConstant,
    getTypeFileImports: () => Array.from(typeFileImports),
    getClientFileImports: () => Array.from(clientFileImports),
  }
}

const reservedJS = [
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "finally",
  "for",
  "if",
  "in",
  "instanceof",
  "return",
  "super",
  "switch",
  "throw",
  "try",
  "var",
  "while",
  "with",
]

export const getDocsTypesBuilder = (
  getLookupEntryDef: MetadataLookup,
  knownTypes: KnownTypes,
  checksumBuilder: ReturnType<typeof getChecksumBuilder>,
) => {
  const { metadata, call } = getLookupEntryDef
  const callsChecksum = call ? checksumBuilder.buildDefinition(call) : null
  const clientFileImports = new Set<string>()
  const fileTypeEntries = new Set<number>()

  // checksum -> types that are imported for it
  const importsPerType = new Map<string, CodegenOutput["imports"]>()

  const declarations = defaultDeclarations()

  const getChecksum = (id: number | StructVar | TupleVar | ArrayVar): string =>
    typeof id === "number"
      ? checksumBuilder.buildDefinition(id)!
      : checksumBuilder.buildComposite(id)!

  const internalBuilder = getInternalTypesBuilder(getLookupEntryDef)

  const buildTypeDefinition = (id: number) => {
    fileTypeEntries.add(id)
    const node = internalBuilder(id)

    const visited = new Set<string>()
    const result = generateTypescript(node, (node, next): CodegenOutput => {
      const checksum =
        "id" in node
          ? getChecksum(node.id)
          : // for types inlined in Enums, we might have an intermediate type
            "original" in node
            ? getChecksum(node.original)
            : null

      const getPapiPrimitive = () => processPapiPrimitives(node, next, true)

      if (!checksum) {
        // It's not a lookup type nor an inlined Enum type
        // Return the primitive type or the regular codegen.
        return getPapiPrimitive() ?? nativeNodeCodegen(node, next)
      }

      if (node.type === "primitive") return nativeNodeCodegen(node, next)
      if (checksum === callsChecksum) {
        return {
          code: "TxCallData",
          imports: {
            client: new Set(["TxCallData"]),
          },
        }
      }

      if (checksum in knownTypes) {
        if (declarations.variables.has(checksum)) {
          const entry = declarations.variables.get(checksum)!
          return {
            code: entry.name,
            imports: {
              types: new Set([entry.name]),
            },
          }
        }

        const variable: Variable = {
          checksum,
          type: "",
          name: knownTypes[checksum].name,
        }
        declarations.variables.set(checksum, variable)
        const generated = getPapiPrimitive() ?? nativeNodeCodegen(node, next)
        variable.type = generated.code
        importsPerType.set(
          checksum,
          mergeImports([
            generated.imports,
            {
              types: new Set([variable.name]),
            },
          ]),
        )

        return {
          code: variable.name,
          imports: {
            types: new Set([variable.name]),
          },
        }
      }

      if (declarations.variables.has(checksum)) {
        const entry = declarations.variables.get(checksum)!
        return {
          code: entry.type,
          imports: importsPerType.get(checksum) ?? {},
        }
      }

      if (visited.has(checksum)) {
        return {
          code: "__Circular",
          imports: {
            types: new Set(["__Circular"]),
          },
        }
      }
      visited.add(checksum)

      const result = getPapiPrimitive() ?? nativeNodeCodegen(node, next)
      declarations.variables.set(checksum, {
        checksum,
        type: result.code,
        name: "I" + checksum,
      })
      importsPerType.set(checksum, result.imports)
      return result
    })
    return result.code
  }

  const buildStorage = (pallet: string, entry: string) => {
    const storageEntry = metadata.pallets
      .find((x) => x.name === pallet)!
      .storage!.items.find((s) => s.name === entry)!

    if (storageEntry.type.tag === "plain")
      return {
        opaque: NEVER_STR,
        args: "[]",
        payload: `${buildTypeDefinition(storageEntry.type.value)}`,
      }

    const { key, value } = storageEntry.type.value
    const payload = buildTypeDefinition(value)

    const hashers = storageEntry.type.value.hashers
    const opaque =
      hashers
        .map((x, idx) => (opaqueHashers.has(x.tag) ? `"${idx}"` : null))
        .filter(Boolean)
        .join(" | ") || NEVER_STR

    const returnKey =
      hashers.length === 1
        ? `[Key: ${buildTypeDefinition(key)}]`
        : buildTypeDefinition(key)

    return { args: returnKey, payload, opaque }
  }

  const buildViewFn = (pallet: string, entry: string) => {
    const fn = metadata.pallets
      .find((x) => x.name === pallet)
      ?.viewFns.find((x) => x.name === entry)
    if (!fn) throw null

    const innerTuple = fn.inputs
      .map(({ name, type }) => `${name}: ${buildTypeDefinition(type)}`)
      .join(", ")

    return {
      args: `[${innerTuple}]`,
      value: buildTypeDefinition(fn.output),
    }
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
        metadata.pallets.find((x) => x.name === pallet)![type]!.type,
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
      if (!thisTypeImports?.types) continue

      for (const singleType of thisTypeImports.types.values()) {
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
    buildViewFn,
    declarations,
    recordTypeFileImports,
    getClientFileImports: () => Array.from(clientFileImports),
    getDescriptorsTypes,
  }
}
