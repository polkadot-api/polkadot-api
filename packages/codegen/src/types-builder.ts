import { StringRecord } from "@polkadot-api/substrate-bindings"
import {
  LookupEntry,
  getChecksumBuilder,
  TupleVar,
  StructVar,
  ArrayVar,
  MetadataLookup,
} from "@polkadot-api/metadata-builders"
import { withCache } from "./with-cache"
import { mapObject } from "@polkadot-api/utils"

type MetadataPrimitives =
  | "bool"
  | "char"
  | "str"
  | "u8"
  | "u16"
  | "u32"
  | "u64"
  | "u128"
  | "u256"
  | "i8"
  | "i16"
  | "i32"
  | "i64"
  | "i128"
  | "i256"

export const primitiveTypes: Record<
  MetadataPrimitives | "compactNumber" | "compactBn",
  string
> = {
  bool: "boolean",
  char: "string",
  str: "string",
  u8: "number",
  u16: "number",
  u32: "number",
  u64: "bigint",
  u128: "bigint",
  u256: "bigint",
  i8: "number",
  i16: "number",
  i32: "number",
  i64: "bigint",
  i128: "bigint",
  i256: "bigint",
  compactNumber: "number",
  compactBn: "bigint",
}

export interface Variable {
  name: string

  checksum: string
  type: string
}

export interface CodeDeclarations {
  imports: Set<string>
  variables: Map<string, Variable>
  takenNames: Set<string>
}

export const defaultDeclarations = (): CodeDeclarations => ({
  imports: new Set(),
  variables: new Map(),
  takenNames: new Set(),
})

interface TypeForEntry {
  type: string
  import?: "globalTypes" | "client"
}
const typesImport = (varName: string): TypeForEntry => ({
  type: varName,
  import: "globalTypes",
})
const clientImport = (varName: string): TypeForEntry => ({
  type: varName,
  import: "client",
})

const _buildSyntax = (
  input: LookupEntry,
  cache: Map<number, TypeForEntry>,
  stack: Set<number>,
  declarations: CodeDeclarations,
  getChecksum: (id: number | StructVar | TupleVar | ArrayVar) => string | null,
  knownTypes: Record<string, string>,
  callsChecksum: string | null,
): TypeForEntry => {
  const addImport = (entry: TypeForEntry) => {
    if (entry.import === "client") declarations.imports.add(entry.type)
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

  const anonymize = (varName: string) => {
    if (!varName.startsWith("I")) return varName
    const checksum = varName.slice(1)
    return declarations.variables.has(checksum)
      ? `Anonymize<${varName}>`
      : varName
  }

  if (input.type === "primitive") return { type: primitiveTypes[input.value] }
  if (input.type === "void") return { type: "undefined" }
  if (input.type === "AccountId20") return clientImport("HexString")
  if (input.type === "AccountId32") return clientImport("SS58String")
  if (input.type === "compact")
    return {
      type: input.isBig
        ? "bigint"
        : input.isBig === null
          ? "number | bigint"
          : "number",
    }
  if (input.type === "bitSequence")
    return { type: "{bytes: Uint8Array, bitsLen: number}" }

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  )
    return { type: "Binary" }

  const checksum = getChecksum(input.id)!

  // Problem: checksum WndPalletEvent = 5ofh7hnvff54m; DotPalletEvent = KsmPalletEvent = 2gc4echvba3ni
  // declarations.variables is checksum -> Var, but now we can have two names for the same checksum
  // currently, the second chain will reuse the first name, so ksm types will have DotPalletEvent (and KsmPalletEvent doesn't exist)
  // TODO declarations.variables should have a way of having multiple type definitions for the same checksum
  // TODO declarations.takenNames should be solved on `resolveConflicts` instead.
  if (declarations.variables.has(checksum)) {
    const entry = declarations.variables.get(checksum)!
    return typesImport(entry.name)
  }

  const buildNextSyntax = (nextInput: LookupEntry) =>
    buildSyntax(
      nextInput,
      cache,
      stack,
      declarations,
      getChecksum,
      knownTypes,
      callsChecksum,
    )

  const buildVector = (id: string, inner: LookupEntry): TypeForEntry => {
    const name = getName(id)
    const variable: Variable = {
      checksum: id,
      type: "",
      name,
    }
    declarations.variables.set(id, variable)
    const innerType = buildNextSyntax(inner)
    addImport(innerType)

    variable.type = `Array<${anonymize(innerType.type)}>`
    return typesImport(name)
  }

  const buildArray = (
    id: string,
    inner: LookupEntry,
    length: number,
  ): TypeForEntry => {
    const name = getName(id)
    const variable: Variable = {
      checksum: id,
      type: "",
      name,
    }
    declarations.variables.set(id, variable)

    if (inner.type === "primitive" && inner.value === "u8") {
      variable.type = `FixedSizeBinary<${length}>`
    } else {
      const innerType = buildNextSyntax(inner)
      addImport(innerType)
      variable.type = `FixedSizeArray<${length}, ${anonymize(innerType.type)}>`
    }

    return typesImport(name)
  }

  const buildTuple = (id: string, value: LookupEntry[]): TypeForEntry => {
    const name = getName(id)
    const variable: Variable = {
      checksum: id,
      type: "",
      name,
    }
    declarations.variables.set(id, variable)
    const innerTypes = value.map(buildNextSyntax)
    innerTypes.forEach(addImport)
    variable.type = `[${innerTypes.map((v) => anonymize(v.type)).join(", ")}]`

    return typesImport(name)
  }

  const buildStruct = (
    id: string,
    value: StringRecord<LookupEntry>,
  ): TypeForEntry => {
    const name = getName(id)
    const variable: Variable = {
      checksum: id,
      type: "",
      name,
    }
    declarations.variables.set(id, variable)
    const deps = mapObject(value, buildNextSyntax)
    Object.values(deps).forEach(addImport)
    variable.type = `{${Object.entries(deps)
      .map(([key, val]) => `${JSON.stringify(key)}: ${anonymize(val.type)}`)
      .join(", ")}}`

    return typesImport(name)
  }

  if (input.type === "array") {
    return buildArray(checksum, input.value, input.len)
  }

  if (input.type === "sequence") return buildVector(checksum, input.value)
  if (input.type === "tuple") return buildTuple(checksum, input.value)
  if (input.type === "struct") return buildStruct(checksum, input.value)

  if (input.type === "option") {
    const name = getName(checksum)
    const variable: Variable = {
      checksum,
      type: "",
      name,
    }
    declarations.variables.set(checksum, variable)

    const innerType = buildNextSyntax(input.value)
    addImport(innerType)

    variable.type = `${anonymize(innerType.type)} | undefined`
    return typesImport(name)
  }

  if (input.type === "result") {
    declarations.imports.add("ResultPayload")
    const name = getName(checksum)
    const variable: Variable = {
      checksum,
      type: "",
      name,
    }
    declarations.variables.set(checksum, variable)
    const ok = buildNextSyntax(input.value.ok)
    const ko = buildNextSyntax(input.value.ko)
    ;[ok, ko].forEach(addImport)
    variable.type = `ResultPayload<${anonymize(ok.type)}, ${anonymize(
      ko.type,
    )}>`

    return typesImport(name)
  }

  // it has to be an enum by now
  const isKnown = !!knownTypes[checksum]

  const name = getName(checksum)
  const variable: Variable = {
    checksum,
    type: "",
    name,
  }
  declarations.variables.set(checksum, variable)

  const dependencies = Object.values(input.value).map((value) => {
    const anonymize = (value: string) => `Anonymize<${value}>`
    if (value.type === "lookupEntry") {
      const inner = buildNextSyntax(value.value)
      addImport(inner)
      return anonymize(inner.type)
    }

    if (value.type === "void") return "undefined"

    let innerChecksum = getChecksum(value)!

    const inner = (() => {
      switch (value.type) {
        case "array":
          return buildArray(innerChecksum, value.value, value.len)
        case "struct":
          return buildStruct(innerChecksum, value.value)
        case "tuple":
          return buildTuple(innerChecksum, value.value)
      }
    })()
    addImport(inner)
    return anonymize(inner.type)
  })

  const obj = Object.keys(input.value)
    .map((key, idx) => `"${key}": ${dependencies[idx]}`)
    .join(", ")
  variable.type = isKnown ? `Enum<{${obj}}>` : `AnonymousEnum<{${obj}}>`
  return checksum === callsChecksum
    ? clientImport("TxCallData")
    : typesImport(name)
}

const buildSyntax = withCache(
  _buildSyntax,
  (
    _getter,
    entry,
    declarations,
    getChecksum,
    _knownTypes,
    callsChecksum,
  ): TypeForEntry => {
    const checksum = getChecksum(entry.id)!
    if (checksum === callsChecksum) return clientImport("TxCallData")
    return typesImport(declarations.variables.get(checksum)!.name)
  },
  (x) => x,
)

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

  const importType = (entry: TypeForEntry) => {
    if (entry.import === "client") {
      clientFileImports.add(entry.type)
    } else if (entry.import === "globalTypes") {
      typeFileImports.add(entry.type)
    }
    return entry.type
  }

  const getChecksum = (id: number | StructVar | TupleVar | ArrayVar): string =>
    typeof id === "number"
      ? checksumBuilder.buildDefinition(id)!
      : checksumBuilder.buildComposite(id)!

  const cache = new Map()
  const buildDefinition = (id: number) =>
    buildSyntax(
      getLookupEntryDef(id),
      cache,
      new Set(),
      declarations,
      getChecksum,
      knownTypes,
      callsChecksum,
    )

  const buildTypeDefinition = (id: number) => {
    const tmp = buildDefinition(id)
    importType(tmp)

    if (!tmp.import || tmp.import === "client") return tmp.type

    const checksum = checksumBuilder.buildDefinition(id)!
    if (knownTypes[checksum]) return tmp.type

    return `Anonymize<${tmp.type}>`
  }

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

      // Generate the type that has all the variants - This is so the consumer can import the type, even if it's not used directly by the descriptor file
      buildDefinition(lookupEntry.id)

      const innerLookup = lookupEntry.value[name]

      if (innerLookup.type === "lookupEntry") {
        const tmp = buildDefinition(innerLookup.value.id)
        importType(tmp)

        return tmp.import === "client" ? tmp.type : `Anonymize<${tmp.type}>`
      } else if (innerLookup.type === "void") {
        return "undefined"
      } else {
        const result = declarations.variables.get(
          getChecksum(innerLookup),
        )!.name
        typeFileImports.add(result)

        return `Anonymize<${result}>`
      }
    }

  const buildConstant = (pallet: string, constantName: string) => {
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
