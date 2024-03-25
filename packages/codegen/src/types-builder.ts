import { StringRecord, V15 } from "@polkadot-api/substrate-bindings"
import {
  LookupEntry,
  getLookupFn,
  getChecksumBuilder,
  TupleVar,
  StructVar,
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
  MetadataPrimitives | "_void" | "compactNumber" | "compactBn",
  string
> = {
  _void: "undefined",
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
  getChecksum: (id: number | StructVar | TupleVar) => string | null,
  knownTypes: Map<string, string>,
): TypeForEntry => {
  const addImport = (entry: TypeForEntry) => {
    if (entry.import === "client") declarations.imports.add(entry.type)
  }

  const getName = (checksum: string) => {
    if (!knownTypes.has(checksum)) return `I${checksum}`

    const originalName = knownTypes.get(checksum)!
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
  if (input.type === "AccountId32") return clientImport("SS58String")
  if (input.type === "compact")
    return { type: input.isBig ? "bigint" : "number" }
  if (input.type === "bitSequence")
    return { type: "{bytes: Uint8Array, bitsLen: number}" }

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  )
    return clientImport("Binary")

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
    buildSyntax(nextInput, cache, stack, declarations, getChecksum, knownTypes)

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
      .map(([key, val]) => `${key}: ${anonymize(val.type)}`)
      .join(", ")}}`

    return typesImport(name)
  }

  if (input.type === "array") {
    // Bytes case
    if (input.value.type === "primitive" && input.value.value === "u8")
      return clientImport("Binary")

    // non-fixed size Vector case
    return buildVector(checksum, input.value)
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
  const isKnown = knownTypes.has(checksum)

  const name = getName(checksum)
  const variable: Variable = {
    checksum,
    type: "",
    name,
  }
  declarations.variables.set(checksum, variable)

  const dependencies = Object.values(input.value).map((value) => {
    const anonymize = (value: string) => `Anonymize<${value}>`
    if (value.type === "lookupEntry")
      return anonymize(buildNextSyntax(value.value))

    if (value.type === "void") return "undefined"

    let innerChecksum = getChecksum(value)!

    const builder = value.type === "tuple" ? buildTuple : buildStruct
    const inner = builder(innerChecksum, value.value as any)
    addImport(inner)
    return anonymize(inner.type)
  })

  variable.type = isKnown
    ? `Enum<${Object.keys(input.value)
        .map((key, idx) => `{ type: "${key}", value: ${dependencies[idx]} }`)
        .join(" | ")}>`
    : `AnonymousEnum<{${Object.keys(input.value)
        .map((key, idx) => `"${key}": ${dependencies[idx]}`)
        .join(" , ")}}>`
  return typesImport(name)
}

const buildSyntax = withCache(
  _buildSyntax,
  (_getter, entry, declarations, getChecksum): TypeForEntry =>
    typesImport(declarations.variables.get(getChecksum(entry.id)!)!.name),
  (x) => x,
)

export const getTypesBuilder = (
  declarations: CodeDeclarations,
  metadata: V15,
  // checksum -> desired-name
  knownTypes: Map<string, string>,
) => {
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

  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)
  const checksumBuilder = getChecksumBuilder(metadata)

  const getChecksum = (id: number | StructVar | TupleVar): string =>
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
    )

  const buildTypeDefinition = (id: number) => {
    const tmp = buildDefinition(id)
    importType(tmp)

    if (!tmp.import || tmp.import === "client") return tmp.type

    const checksum = checksumBuilder.buildDefinition(id)!
    if (knownTypes.has(checksum)) return tmp.type

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

      const newReturn = declarations.variables.get(
        getChecksum(innerLookup),
      )!.name
      typeFileImports.add(newReturn)

      return `Anonymize<${newReturn}>`
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
