import { StringRecord, V15 } from "@polkadot-api/substrate-bindings"
import {
  LookupEntry,
  getLookupFn,
  getChecksumBuilder,
  TupleVar,
  StructVar,
  VoidVar,
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

const _buildSyntax = (
  input: LookupEntry,
  cache: Map<number, string>,
  stack: Set<number>,
  declarations: CodeDeclarations,
  getChecksum: (id: number | StructVar | TupleVar | VoidVar) => string | null,
  knownTypes: Map<string, string>,
): string => {
  const addImport = (varName: string) => {
    declarations.imports.add(varName)
    return varName
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

  if (input.type === "primitive") return primitiveTypes[input.value]
  if (input.type === "AccountId32") return addImport("SS58String")
  if (input.type === "compact") return input.isBig ? "bigint" : "number"
  if (input.type === "bitSequence")
    return "{bytes: Uint8Array, bitsLen: number}"

  if (
    input.type === "sequence" &&
    input.value.type === "primitive" &&
    input.value.value === "u8"
  )
    return addImport("Binary")

  const checksum = getChecksum(input.id)!

  if (declarations.variables.has(checksum)) {
    const entry = declarations.variables.get(checksum)!
    return entry.name ?? entry.type
  }

  const buildNextSyntax = (nextInput: LookupEntry): string =>
    buildSyntax(nextInput, cache, stack, declarations, getChecksum, knownTypes)

  const buildVector = (id: string, inner: LookupEntry) => {
    const name = getName(id)
    const variable: Variable = {
      checksum: id,
      type: "",
      name,
    }
    declarations.variables.set(id, variable)
    const innerType = buildNextSyntax(inner)

    variable.type = `Array<${anonymize(innerType)}>`
    return name
  }

  const buildTuple = (id: string, value: LookupEntry[]) => {
    const name = getName(id)
    const variable: Variable = {
      checksum: id,
      type: "",
      name,
    }
    declarations.variables.set(id, variable)
    variable.type = `[${value.map(buildNextSyntax).map(anonymize).join(", ")}]`
    return name
  }

  const buildStruct = (id: string, value: StringRecord<LookupEntry>) => {
    const name = getName(id)
    const variable: Variable = {
      checksum: id,
      type: "",
      name,
    }
    declarations.variables.set(id, variable)
    const deps = mapObject(value, buildNextSyntax)
    variable.type = `{${Object.entries(deps)
      .map(([key, val]) => `${key}: ${anonymize(val)}`)
      .join(", ")}}`
    return name
  }

  if (input.type === "array") {
    // Bytes case
    if (input.value.type === "primitive" && input.value.value === "u8")
      return "Binary"

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

    variable.type = `${anonymize(buildNextSyntax(input.value))} | undefined`
    return name
  }

  if (input.type === "result") {
    addImport("ResultPayload")
    const name = getName(checksum)
    const variable: Variable = {
      checksum,
      type: "",
      name,
    }
    declarations.variables.set(checksum, variable)
    const ok = buildNextSyntax(input.value.ok)
    const ko = buildNextSyntax(input.value.ko)
    variable.type = `ResultPayload<${anonymize(ok)}, ${anonymize(ko)}>`
    return name
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

  const dependencies = Object.entries(input.value).map(([key, value]) => {
    if (value.type === "primitive") return "undefined"

    let innerChecksum: string
    const anonymize = (value: string) => `Anonymize<${value}>`

    if (value.type === "tuple" && value.value.length === 1) {
      innerChecksum = getChecksum(value.value[0].id)!
      return anonymize(buildNextSyntax(value.value[0]))
    }
    innerChecksum = getChecksum(input.value[key])!

    const builder = value.type === "tuple" ? buildTuple : buildStruct
    return anonymize(builder(innerChecksum, value.value as any))
  })

  variable.type = isKnown
    ? `Enum<${Object.keys(input.value)
        .map((key, idx) => `{ type: "${key}", value: ${dependencies[idx]} }`)
        .join(" | ")}>`
    : `AnonymousEnum<{${Object.keys(input.value)
        .map((key, idx) => `"${key}": ${dependencies[idx]}`)
        .join(" , ")}}>`
  return name
}

const buildSyntax = withCache(
  _buildSyntax,
  (_getter, entry, declarations, getChecksum) =>
    declarations.variables.get(getChecksum(entry.id)!)!.name,
  (x) => x,
)

export const getTypesBuilder = (
  metadata: V15,
  // checksum -> desired-name
  knownTypes: Map<string, string>,
) => {
  const declarations: CodeDeclarations = {
    imports: new Set(),
    variables: new Map(),
    takenNames: new Set(),
  }

  const lookupData = metadata.lookup
  const getLookupEntryDef = getLookupFn(lookupData)
  const checksumBuilder = getChecksumBuilder(metadata)

  const getChecksum = (id: number | StructVar | TupleVar | VoidVar): string =>
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

    const checksum = checksumBuilder.buildDefinition(id)!
    const variable = declarations.variables.get(checksum)
    if (!variable) return tmp

    if (knownTypes.has(checksum)) return variable.name

    return `Anonymize<${variable.name}>`
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
      buildDefinition(lookupEntry.id)

      const innerLookup = lookupEntry.value[name]
      if (innerLookup.type === "primitive") return "undefined"

      if (innerLookup.type === "tuple" && innerLookup.value.length === 1)
        return buildTypeDefinition(innerLookup.value[0].id)

      return declarations.variables.get(getChecksum(innerLookup))!.type
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
    getDeclarations: () => declarations,
  }
}
